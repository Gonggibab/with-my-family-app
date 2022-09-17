import emailjs from '@emailjs/browser';

export const sendEmailVerification = (name: string, email: string) => {
  let randomNumber = '';

  for (let i = 0; i < 6; i++) {
    randomNumber += Math.floor(Math.random() * 9);
  }

  const templetData = {
    to_name: name,
    to_email: email,
    verify_code: randomNumber,
  };

  emailjs
    .send(
      'service_bcqy929',
      'template_6krp89b',
      templetData,
      'i3AiNzvhRYwjqvZR_'
    )
    .then(
      (res) => {
        randomNumber = randomNumber;
      },
      (err) => {
        randomNumber = '';
      }
    );

  return randomNumber;
};
