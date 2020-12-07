import SessionController from '../app/controllers/SessionController';

export default {
  host: 'smtp.mailtrap.io',
  port: 2525,
  secure: false,
  auth: {
    user: 'e59e1f9d53ed0e',
    pass: 'c18b76d71ed352',
  },
  default: {
    from: 'support gobarber <noreplay@gobarber.com>',
  },
};

// Emails services
// Amazon SES, Mailgun,Sparkpost,Mandril(mailchimp),gmail, (producao)
// mailtrap(desenvolvimento)
