interface EmailTemplateInput {
  to: string
  code: string
  webUrl: string
  projectName: string
  source: string
}

export function templates() {
  function verificationEmail(data: EmailTemplateInput) {
    const { to, code, projectName, webUrl, source } = data
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<html>
              <head></head>
              <body>
                <h1>Verify your email address</h1>
                <p>Thank you for signing up for ${projectName}. To complete your registration, please verify your email address:</p>
                <p><a href="${webUrl}" target="_blank">Verify Your Email Address</a></p>
                <p>If you have any questions, please contact us at <a href="mailto:${to}">${to}</a>.</p>
                <p>Your verification code: <strong>${code}</strong></p>
                <p>Thanks!</p>

                <p>Project Name: ${projectName}</p>
              </body>
            </html>`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Verify your email address',
        },
      },
      Source: source,
    }

    return params
  }

  function forgotPassword(data: Omit<EmailTemplateInput, 'projectName'>) {
    const { to, code, webUrl, source } = data
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<html>
              <head></head>
              <body>
                <h1>Reset your password</h1>
                <p>Click the link below to reset your password:</p>
                <p><a href="${webUrl}" target="_blank">Reset Your Password</a></p>
                <p>If you have any questions, please contact us at <a href="mailto:${to}">${to}</a>.</p>
                <p>Your verification code: <strong>${code}</strong></p>
                <p>Thanks!</p>
              </body>
            </html>`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Reset your password',
        },
      },
      Source: source,
    }

    return params
  }

  function changePassword(data: Omit<EmailTemplateInput, 'projectName'>) {
    const { to, code, webUrl, source } = data
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<html>
              <head></head>
              <body>
                <h1>Change your password</h1>
                <p>Click the link below to change your password:</p>
                <p><a href="${webUrl}" target="_blank">Change Your Password</a></p>
                <p>If you have any questions, please contact us at <a href="mailto:${to}">${to}</a>.</p>
                <p>Your verification code: <strong>${code}</strong></p>
                <p>Thanks!</p>
              </body>
            </html>`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Change your password',
        },
      },
      Source: source,
    }

    return params
  }

  function changeEmail(data: Omit<EmailTemplateInput, 'projectName'>) {
    const { to, code, webUrl, source } = data
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<html>
              <head></head>
              <body>
                <h1>Change your email address</h1>
                <p>To update your email address, please click the link below:</p>
                <p><a href="${webUrl}" target="_blank">Change Your Email Address</a></p>
                <p>If you have any questions, please contact us at <a href="mailto:${to}">${to}</a>.</p>
                <p>Your verification code: <strong>${code}</strong></p>
                <p>Thanks!</p>
              </body>
            </html>`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Change your email address',
        },
      },
      Source: source,
    }

    return params
  }

  function login(data: Omit<EmailTemplateInput, 'projectName' | 'code'>) {
    const { to, webUrl, source } = data
    const params = {
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: `<html>
              <head></head>
              <body>
                <h1>Welcome</h1>
                <p>Thank you for choosing us. To access your account, please use the link below:</p>
                <p><a href="${webUrl}" target="_blank">Login to Your Account</a></p>
                <p>If you have any questions, feel free to contact us.</p>
              </body>
            </html>`,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Login',
        },
      },
      Source: source,
    }

    return params
  }
  return {
    verificationEmail,
    forgotPassword,
    changePassword,
    changeEmail,
    login,
  }
}
