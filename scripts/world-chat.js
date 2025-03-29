document.addEventListener('DOMContentLoaded', async () => {
    const SERVER_URL = 'https://tbsm41-backend.onrender.com';
    const ADMIN_EMAILS = ['ujandey007@gmail.com'];

    console.log('Page loaded, initializing...');

    const supabase = window.supabase ? window.supabase.createClient(
        'https://sgglpfgshlveyfbqfipy.supabase.co',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnZ2xwZmdzaGx2ZXlmYnFmaXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNjE2OTEsImV4cCI6MjA1NzkzNzY5MX0.fPynlb5orMDaH4SDyvwYNe5Wy82VDA3lVHPERxaxS0o'
    ) : null;

    if (!supabase) {
        console.error('Supabase library not loaded.');
        document.body.innerHTML = '<p>Oops, something broke!</p>';
        return;
    }

    let user = null;
    let token = null;
    try {
        console.log('Fetching Supabase session...');
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) throw new Error('No user found');
        user = session.user;
        token = session.access_token;
        console.log('User authenticated:', user.email);
    } catch (err) {
        console.error('Auth failed:', err.message);
        showPopup('Please log in to chat!', 0);
        document.getElementById('chat-input').disabled = true;
        document.getElementById('send-chat-btn').disabled = true;
        document.getElementById('emoji-btn').disabled = true;
    }

    const reactionMap = {};

    if (user && token) {
        console.log('Setting up Pusher...');
        const pusher = new Pusher('77ea7a0133da02d22aa5', { cluster: 'ap2', forceTLS: true });
        const channel = pusher.subscribe('world-chat');

        channel.bind('pusher:subscription_succeeded', () => updateOnlineCounter(1));
        channel.bind('pusher:subscription_error', (err) => {
            console.error('Pusher subscription error:', err);
            showPopup('Real-time chat failed—refresh!', 3000);
        });
        channel.bind('new-message', (data) => {
            console.log('New message received:', data);
            appendChatMessage(data);
            scrollChatToBottom();
        });
        // ... (other channel bindings unchanged)

        pusher.connection.bind('error', (err) => showPopup('Connection lost—check your net!', 3000));
        pusher.connection.bind('connected', () => console.log('Pusher connected!'));

        document.querySelector('.loading-screen').style.display = 'none';

        try {
            console.log('Loading initial chat data...');
            const { data: messages } = await supabase.from('world_chat').select('*').order('created_at', { ascending: true }).limit(50);
            if (messages) messages.forEach(appendChatMessage);
            // ... (rest of initial load unchanged)
            scrollChatToBottom();
        } catch (err) {
            console.error('Data load failed:', err);
            showPopup('Failed to load chat data', 3000);
        }

        const sendBtn = document.getElementById('send-chat-btn');
        const chatInput = document.getElementById('chat-input');
        sendBtn.addEventListener('click', () => {
            console.log('Send button clicked');
            sendChatMessage();
        });
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                console.log('Enter pressed');
                sendChatMessage();
            }
        });
        // ... (emoji picker and other listeners unchanged)
    }

    function showPopup(message, duration = 2000) {
        const popup = document.getElementById('popup');
        popup.textContent = message;
        popup.classList.add('show');
        if (duration > 0) setTimeout(() => popup.classList.remove('show'), duration);
    }

    function appendChatMessage(msg) {
        // ... (unchanged)
    }

    // ... (other functions like updateReaction, updatePinnedMessage, etc. unchanged)

    async function sendChatMessage() {
        if (!user) return showPopup('Log in to chat!', 3000);
        let message = document.getElementById('chat-input').value.trim();
        if (!message) return showPopup('Type something!', 3000);

        const userName = user.user_metadata.name || user.email.split('@')[0];
        let msgData = { user_id: user.id, message, submitted_by: userName, created_at: new Date().toISOString() };

        if (message.startsWith('/')) {
            // ... (command handling unchanged)
        }

        try {
            console.log('Inserting message into Supabase...');
            const { data, error } = await supabase.from('world_chat').insert(msgData).select();
            if (error) throw new Error(error.message);
            msgData.id = data[0].id;
            console.log('Sending to backend:', {
                url: `${SERVER_URL}/send-message`,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ channel: 'world-chat', event: 'new-message', data: msgData })
            });
            const res = await fetch(`${SERVER_URL}/send-message`, {
                method: 'POST',
                mode: 'cors', // Explicitly set
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ channel: 'world-chat', event: 'new-message', data: msgData })
            });
            if (!res.ok) throw new Error(await res.text());
            const responseData = await res.json();
            if (responseData.success) {
                console.log('Message sent successfully');
                document.getElementById('chat-input').value = '';
            } else {
                throw new Error('Server confirmed but no success');
            }
        } catch (err) {
            console.error('Send error:', err);
            showPopup(`Failed to send: ${err.message}`, 3000);
            appendChatMessage(msgData);
            scrollChatToBottom();
        }
    }

    // ... (deleteChatMessage and other functions unchanged)
});