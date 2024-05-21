const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const password = document.getElementById('password');
const password2 = document.getElementById('password2');

// Function to get saved user infos from localStorage
const getSavedUserInfos = () => {
  const userInfosJSON = localStorage.getItem('userInfos');
  try {
    return userInfosJSON ? JSON.parse(userInfosJSON) : [];
  } catch {
    return [];
  }
};

// Function to save user infos to localStorage
const saveUserInfos = (userInfos) => {
  localStorage.setItem('userInfos', JSON.stringify(userInfos));
};

// Functions to show error and success messages
const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  errorDisplay.innerText = message;
  inputControl.classList.add('error');
  inputControl.classList.remove('success');
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  errorDisplay.innerText = '';
  inputControl.classList.add('success');
  inputControl.classList.remove('error');
};

// Function to validate email format
const isValidEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// Validation functions
const checkRequired = (inputArr) => {
  let isValid = true;
  inputArr.forEach(input => {
    if (input.value.trim() === '') {
      setError(input, `${input.placeholder} is required`);
      isValid = false;
    } else {
      setSuccess(input);
    }
  });
  return isValid;
};

const checkLength = (input, min, max) => {
  let isValid = true;
  if (input.value.length < min) {
    setError(input, `${input.placeholder} must be at least ${min} characters`);
    isValid = false;
  } else if (input.value.length > max) {
    setError(input, `${input.placeholder} must be less than ${max} characters`);
    isValid = false;
  } else {
    setSuccess(input);
  }
  return isValid;
};

const checkEmail = (input) => {
  let isValid = true;
  if (!isValidEmail(input.value.trim())) {
    setError(input, 'Email is not valid');
    isValid = false;
  } else {
    setSuccess(input);
  }
  return isValid;
};

const checkPasswordsMatch = (input1, input2) => {
  let isValid = true;
  if (input1.value !== input2.value) {
    setError(input2, 'Passwords do not match');
    isValid = false;
  } else {
    setSuccess(input2);
  }
  return isValid;
};

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const isUsernameValid = checkRequired([username]) && checkLength(username, 3, 15);
  const isEmailValid = checkRequired([email]) && checkEmail(email);
  const isPasswordValid = checkRequired([password]) && checkLength(password, 6, 25);
  const isPassword2Valid = checkRequired([password2]) && checkPasswordsMatch(password, password2);

  const isFormValid = isUsernameValid && isEmailValid && isPasswordValid && isPassword2Valid;

  if (isFormValid) {
    const userId = uuidv4();
    const userInfos = getSavedUserInfos();

    userInfos.push({
      id: userId,
      username: username.value,
      email: email.value,
      password: password.value
    });

    saveUserInfos(userInfos);
    alert('User registered successfully!');
    form.reset();
    document.querySelectorAll('.input-control').forEach(control => {
      control.classList.remove('success');
    });
  }
});
