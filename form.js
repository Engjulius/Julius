let isLogin = true;

document.getElementById('switch-link').addEventListener('click', () => {
  isLogin = !isLogin;
  document.getElementById('title').textContent = isLogin ? 'Login' : 'Sign Up';
  document.getElementById('submit-btn').textContent = isLogin ? 'Login' : 'Sign Up';
  document.getElementById('email').style.display = isLogin ? 'none' : 'block';
  document.getElementById('switch-text').innerHTML = isLogin
    ? `Don't have an account? <span id="switch-link">Sign up</span>`'t have an account? <span id="switch-link">Sign up</span>`
    : `Already have an account? <span id="switch-link">Login</span>`;
  document.getElementById(''switch-link'').addEventListener(''click'', arguments.callee);
});

document.getElementById(''auth-form'').addEventListener(''submit'', (e) => {
  e.preventDefault();
  const username = document.getElementById(''username'').value;
  const password = document.getElementById(''password'').value;
  const email = document.getElementById(''email'').value;

  if (isLogin) {
                   
    console.log(''Login:'', { username, password });
  } else {
                    
    console.log(''Signup:', { username, password, email });
  }
});
