document.addEventListener('DOMContentLoaded', () => {
  const supabase = window.supabase ? window.supabase.createClient(
    'https://sgglpfgshlveyfbqfipy.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNnZ2xwZmdzaGx2ZXlmYnFmaXB5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIzNjE2OTEsImV4cCI6MjA1NzkzNzY5MX0.fPynlb5orMDaH4SDyvwYNe5Wy82VDA3lVHPERxaxS0o'
  ) : null;

  if (!supabase) {
    console.error('Supabase library not loaded or failed to initialize. Check the script tag in your HTML.');
    return;
  }
  console.log('Supabase initialized!');

  const authBtn = document.getElementById('authBtn');
  const logoutBtn = document.getElementById('logout');
  const authLinks = document.getElementById('auth-links');
  const loggedInSection = document.getElementById('logged-in');
  const userNameEl = document.getElementById('userName');
  const modal = document.getElementById('authModal');
  const closeModal = document.getElementById('closeModal');
  const googleBtn = document.getElementById('googleLogin');
  const githubBtn = document.getElementById('githubLogin');
  const authForm = document.querySelector('.auth-form');
  const signupBtn = document.getElementById('signupBtn');
  const loginBtn = document.getElementById('loginBtn');
  const loadingScreen = document.getElementById('loadingScreen');
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  console.log('DOM loaded! authBtn:', authBtn, 'modal:', modal);

  if (!authBtn || !modal) {
    console.error('Missing elements! authBtn:', authBtn, 'modal:', modal);
    return;
  }

  // Hamburger Menu Toggle
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });

  authBtn.addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Auth button clicked!');
    modal.style.display = 'block';
  });

  closeModal.addEventListener('click', () => {
    console.log('Close modal clicked!');
    modal.style.display = 'none';
  });

  googleBtn.addEventListener('click', async () => {
    try {
        console.log('Google login clicked!');
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: { redirectTo: 'https://tbsm4l.vercel.app' } // Replace with your Vercel URL
        });
        console.log('Google response:', data, 'Error:', error);
        if (error) throw error;
    } catch (error) {
        console.error('Google login failed:', error.message);
        alert('Google login failed—check console!');
    }
});

githubBtn.addEventListener('click', async () => {
    try {
        console.log('GitHub login clicked!');
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: { redirectTo: 'https://tbsm4l.vercel.app' } // Replace with your Vercel URL
        });
        console.log('GitHub response:', data, 'Error:', error);
        if (error) throw error;
    } catch (error) {
        console.error('GitHub login failed:', error.message);
        alert('GitHub login failed—check console!');
    }
});

  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmail').value;
    const password = document.getElementById('authPassword').value;
    const isSignup = e.submitter === signupBtn;

    try {
      if (isSignup) {
        console.log('Signup attempt:', email);
        const { data, error } = await supabase.auth.signUp({ email, password });
        console.log('Signup response:', data, 'Error:', error);
        if (error) throw error;
        alert('Signup successful! Check your email to confirm.');
      } else {
        console.log('Login attempt:', email);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        console.log('Login response:', data, 'Error:', error);
        if (error) throw error;
        localStorage.setItem('token', data.session.access_token);
        modal.style.display = 'none';
        checkLoginStatus();
      }
    } catch (error) {
      console.error('Auth error:', error.message);
      alert('Auth failed—check console!');
    }
  });

  logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    try {
      console.log('Logout clicked!');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem('token');
      showLogin();
    } catch (error) {
      console.error('Logout failed:', error.message);
      alert('Logout failed—check console!');
    }
  });

  async function checkLoginStatus() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const { data: { user } } = await supabase.auth.getUser();
      userNameEl.textContent = user.user_metadata.name || user.email.split('@')[0];
      localStorage.setItem('token', session.access_token);
      showLoggedIn();
    } else {
      localStorage.removeItem('token');
      showLogin();
    }
    // Hide loading screen after auth check
    loadingScreen.style.display = 'none';
  }

  function showLogin() {
    authLinks.style.display = 'block';
    loggedInSection.style.display = 'none';
  }

  function showLoggedIn() {
    authLinks.style.display = 'none';
    loggedInSection.style.display = 'block';
  }

  supabase.auth.onAuthStateChange((event, session) => {
    console.log('Auth event:', event);
    if (event === 'SIGNED_IN') {
      localStorage.setItem('token', session.access_token);
      modal.style.display = 'none';
      window.history.replaceState({}, document.title, window.location.pathname);
      checkLoginStatus();
    } else if (event === 'SIGNED_OUT') {
      localStorage.removeItem('token');
      showLogin();
    }
  });

  checkLoginStatus();
});