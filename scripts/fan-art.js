document.addEventListener('DOMContentLoaded', async () => {
    const supabase = window.supabase ? window.supabase.createClient(
        'https://sgglpfgshlveyfbqfipy.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnZ2xwZmdzaGx2ZXlmYnFmaXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNjE2OTEsImV4cCI6MjA1NzkzNzY5MX0.fPynlb5orMDaH4SDyvwYNe5Wy82VDA3lVHPERxaxS0o'
    ) : null;

    if (!supabase) {
        console.error('Supabase library not loaded or failed to initialize.');
        document.body.innerHTML = '<p>Oops, something broke. Refresh or check console!</p>';
        return;
    }
    console.log('Supabase initialized!');

    let user = null;
    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
        console.error('Auth check failed:', authError ? authError.message : 'No user found');
        window.location.href = '/index.html';
        return;
    }
    user = authUser;
    console.log('User authenticated:', user);

    document.querySelector('.loading-screen').style.display = 'none';
    loadFanArt('newest');

    function showPopup(message, duration = 2000) {
        const popup = document.getElementById('popup');
        popup.textContent = message;
        popup.classList.add('show');
        setTimeout(() => popup.classList.remove('show'), duration);
    }

    document.querySelectorAll('.filter-bar button[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => loadFanArt(btn.dataset.filter));
    });

    document.getElementById('submit-art-btn').addEventListener('click', () => {
        document.getElementById('upload-modal').style.display = 'flex';
    });

    document.querySelector('.close-upload').addEventListener('click', () => {
        document.getElementById('upload-modal').style.display = 'none';
    });

    document.getElementById('upload-btn').addEventListener('click', uploadArt);

    document.querySelector('.hamburger').addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
    });

    async function loadFanArt(filter) {
        console.log(`Loading fan art with filter: ${filter}`);
        
        let query = supabase.from('fan_art').select('*');
        
        switch (filter) {
            case 'newest':
                query = query.order('created_at', { ascending: false });
                break;
            case 'most-liked':
                query = query.order('like_count', { ascending: false });
                break;
            case 'trending':
                query = query.order('trending_score', { ascending: false });
                break;
            default:
                console.warn('Unknown filter, defaulting to newest');
                query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (error) {
            console.error('Fetch error:', error.message, error);
            showPopup('Failed to load fan art—check console!');
            return;
        }
        console.log('Fetched data:', data);

        const grid = document.querySelector('.art-grid');
        grid.innerHTML = '';
        if (!data || data.length === 0) {
            grid.innerHTML = '<p>No fan art yet—be the first to submit!</p>';
        } else {
            data.forEach(art => {
                const div = document.createElement('div');
                const img = document.createElement('img');
                img.src = art.image_url;
                img.dataset.id = art.id;
                img.addEventListener('click', () => showArtModal(art));
                const name = document.createElement('p');
                name.textContent = `By: ${art.submitted_by || 'Unknown'}`;
                div.appendChild(img);
                div.appendChild(name);
                grid.appendChild(div);
            });
        }

        document.querySelectorAll('.filter-bar button[data-filter]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
    }

    async function showArtModal(art) {
        const modal = document.getElementById('art-modal');
        modal.querySelector('.full-art').src = art.image_url;
        modal.querySelector('.caption').textContent = art.caption || '';
        modal.querySelector('.like-count').textContent = art.like_count || 0;
        modal.style.display = 'flex';

        const likeCheckbox = modal.querySelector('#like-checkbox');
        const { data: existingLikes } = await supabase.from('likes').select('*').eq('user_id', user.id).eq('art_id', art.id);
        likeCheckbox.checked = existingLikes.length > 0;
        likeCheckbox.disabled = false;
        likeCheckbox.onclick = () => likeArt(art.id, likeCheckbox.checked);

        const deleteBtn = modal.querySelector('.delete-btn');
        if (user.id === art.user_id) {
            deleteBtn.style.display = 'block';
            deleteBtn.onclick = () => deleteArt(art.id, art.image_url);
        } else {
            deleteBtn.style.display = 'none';
        }

        const commentsList = modal.querySelector('.comments-list');
        const { data: comments, error: commentError } = await supabase
            .from('comments')
            .select('*')
            .eq('art_id', art.id)
            .order('created_at', { ascending: true });
        if (commentError) {
            console.error('Comment Fetch Error:', commentError.message, commentError);
            commentsList.innerHTML = '<p>Error loading comments.</p>';
        } else {
            commentsList.innerHTML = comments.length > 0
                ? comments.map(c => `<p>${c.content} - ${c.submitted_by || user.user_metadata.name || c.user_id.slice(0, 8)}</p>`).join('')
                : '<p>No comments yet—be the first!</p>';
        }

        modal.querySelector('.comment-btn').onclick = () => postComment(art.id);
        modal.querySelector('.share-btn').onclick = () => shareArt(art.image_url);
        modal.querySelector('.close-modal').onclick = () => modal.style.display = 'none';
    }

    async function uploadArt() {
        const file = document.getElementById('art-file').files[0];
        const caption = document.getElementById('art-caption').value;

        console.log('File to upload:', file);
        if (!file) return showPopup('Pick an image, bro!');
        if (!file.type.match('image/(jpeg|png)')) return showPopup('JPG or PNG only!');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'fan-art-preset');
        console.log('Uploading to Cloudinary...');

        const response = await fetch('https://api.cloudinary.com/v1_1/dgtkr4epk/image/upload', {
            method: 'POST',
            body: formData
        });
        const result = await response.json();
        if (!response.ok) {
            console.error('Cloudinary Upload Error:', result.error.message, result);
            showPopup('Upload failed—check console!');
            return;
        }
        console.log('Cloudinary Upload Success:', result);

        const imageUrl = result.secure_url;
        const userName = user.user_metadata.name || user.email.split('@')[0];
        console.log('Inserting into Supabase:', imageUrl, userName);

        const { data: insertData, error: insertError } = await supabase.from('fan_art').insert({
            user_id: user.id,
            image_url: imageUrl,
            caption,
            created_at: new Date().toISOString(),
            like_count: 0,
            trending_score: 0,
            submitted_by: userName
        });

        if (insertError) {
            console.error('Supabase Insert Error:', insertError.message, insertError);
            showPopup('Failed to save art—check console!');
            return;
        }
        console.log('Insert successful:', insertData);

        document.getElementById('upload-modal').style.display = 'none';
        loadFanArt('newest');
    }

    async function likeArt(artId, isChecked) {
        if (!user) {
            showPopup('Log in to like, bro!');
            return;
        }

        const { data: existingLikes } = await supabase.from('likes').select('*').eq('user_id', user.id).eq('art_id', artId);
        const { data: art } = await supabase.from('fan_art').select('like_count, created_at').eq('id', artId).single();

        if (isChecked && existingLikes.length === 0) {
            const { error: insertError } = await supabase.from('likes').insert({ user_id: user.id, art_id: artId });
            if (insertError) {
                console.error('Like Insert Error:', insertError.message, insertError);
                showPopup('Failed to like—check console!');
                return;
            }
            const newCount = (art.like_count || 0) + 1;
            const trendingScore = newCount * Math.exp(-((Date.now() - new Date(art.created_at)) / (7 * 24 * 60 * 60 * 1000)));
            const { error: updateError } = await supabase.from('fan_art').update({
                like_count: newCount,
                trending_score: trendingScore
            }).eq('id', artId);
            if (updateError) {
                console.error('Like Update Error:', updateError);
                showPopup('Failed to update likes—check console!');
            } else {
                document.querySelector('.like-count').textContent = newCount;
            }
        } else if (!isChecked && existingLikes.length > 0) {
            const { error: deleteError } = await supabase.from('likes').delete().eq('user_id', user.id).eq('art_id', artId);
            if (deleteError) {
                console.error('Like Delete Error:', deleteError.message, deleteError);
                showPopup('Failed to unlike—check console!');
                return;
            }
            const newCount = (art.like_count || 0) - 1;
            const trendingScore = newCount * Math.exp(-((Date.now() - new Date(art.created_at)) / (7 * 24 * 60 * 60 * 1000)));
            const { error: updateError } = await supabase.from('fan_art').update({
                like_count: newCount,
                trending_score: trendingScore
            }).eq('id', artId);
            if (updateError) {
                console.error('Unlike Update Error:', updateError);
                showPopup('Failed to update likes—check console!');
            } else {
                document.querySelector('.like-count').textContent = newCount;
            }
        }
    }

    async function postComment(artId) {
        if (!user) {
            showPopup('Log in to comment, bro!');
            return;
        }
        const content = document.querySelector('.comment-input').value.trim();
        if (!content) {
            showPopup('Type something to comment, bro!');
            return;
        }

        console.log('Posting comment for art_id:', artId, 'by user:', user.id);
        const userName = user.user_metadata.name || user.email.split('@')[0];
        const { data, error } = await supabase.from('comments').insert({
            user_id: user.id,
            art_id: artId,
            content,
            submitted_by: userName,
            created_at: new Date().toISOString()
        });
        if (error) {
            console.error('Comment Insert Error:', error.message, error.status, error);
            showPopup('Failed to post comment—check console!');
            return;
        }
        console.log('Comment posted:', data);

        document.querySelector('.comment-input').value = '';
        const { data: art } = await supabase.from('fan_art').select('*').eq('id', artId).single();
        showArtModal(art);
    }

    function shareArt(url) {
        const shareText = `Check out this Seedhe Maut fan art: ${url}`;
        navigator.clipboard.writeText(shareText)
            .then(() => {
                console.log('Share URL copied:', shareText);
                const shareBtn = document.querySelector('.share-btn');
                shareBtn.innerHTML = '<i class="fas fa-check"></i>';
                shareBtn.style.color = '#33cc33';
                setTimeout(() => {
                    shareBtn.innerHTML = '<i class="fas fa-share"></i>';
                    shareBtn.style.color = '#ff4444';
                }, 2000);
                showPopup('Copied to clipboard!');
            })
            .catch(err => {
                console.error('Clipboard Error:', err);
                showPopup('Failed to copy—paste manually: ' + shareText);
            });
    }

    async function deleteArt(artId, imageUrl) {
        if (!confirm('Sure you want to delete this art, bro?')) return;

        const { error: likesError } = await supabase.from('likes').delete().eq('art_id', artId);
        if (likesError) {
            console.error('Likes Delete Error:', likesError.message, likesError);
            showPopup('Failed to delete likes—check console!');
            return;
        }

        const { error: commentsError } = await supabase.from('comments').delete().eq('art_id', artId);
        if (commentsError) {
            console.error('Comments Delete Error:', commentsError.message, commentsError);
            showPopup('Failed to delete comments—check console!');
            return;
        }

        console.log('Deleting image from Cloudinary not implemented yet:', imageUrl);
        const { error } = await supabase.from('fan_art').delete().eq('id', artId).eq('user_id', user.id);
        if (error) {
            console.error('Delete Error:', error.message, error);
            showPopup('Failed to delete art—check console!');
            return;
        }
        console.log('Art deleted from Supabase');
        document.getElementById('art-modal').style.display = 'none';
        loadFanArt('newest');
    }
});