// Function to send appointment confirmation email
import nodemailer from "nodemailer";
export const sendAppointmentConfirmationEmail = async (appointmentData) => {
  try {
    // Configure nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // HTML email template
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: appointmentData.userData.email,
      subject: "Appointment Confirmation - Payment Successful",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              margin: 0;
              padding: 0;
              font-family: Arial, Helvetica, sans-serif;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
              background-color: #4CAF50;
              color: #ffffff;
              text-align: center;
              padding: 20px;
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content {
              padding: 20px;
            }
            .content h2 {
              color: #333333;
              font-size: 20px;
              margin-bottom: 10px;
            }
            .content p {
              color: #666666;
              line-height: 1.6;
              margin: 10px 0;
            }
            .details {
              background-color: #f9f9f9;
              padding: 15px;
              border-radius: 5px;
              margin: 15px 0;
            }
            .details p {
              margin: 5px 0;
              color: #333333;
            }
            .footer {
              background-color: #f4f4f4;
              text-align: center;
              padding: 10px;
              font-size: 12px;
              color: #666666;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #4CAF50;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              margin: 10px 0;
            }
            @media only screen and (max-width: 600px) {
              .container {
                width: 100%;
                margin: 10px;
              }
              .header h1 {
                font-size: 20px;
              }
              .content h2 {
                font-size: 18px;
              }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Appointment Confirmation</h1>
            </div>
            <div class="content">
              <h2>Dear Patient,</h2>
              <p>Your payment for the appointment has been successfully processed. Thank you for choosing our services!</p>
              <div class="details">
                <h3>Appointment Details</h3>
                <p><strong>Appointment ID:</strong> ${appointmentData?._id}</p>
                <p><strong>Date:</strong> ${appointmentData?.slotDate}</p>
                <p><strong>Time:</strong> ${appointmentData?.slotTime}</p>
                <p><strong>Doctor:</strong> ${
                  appointmentData?.docData?.email
                }</p>
                <p><strong>Amount Paid:</strong> $${appointmentData?.amount.toFixed(
                  2
                )}</p>
              </div>
              <p>We look forward to serving you. If you have any questions, please contact our support team.</p>
              <a href="https://doctors-portal-gokj.onrender.com/my-appointments" class="button">View Appointments</a>
            </div>
            <div class="footer">
              <p>Doctors Portal Team<br>
              &copy; 2025 Doctors Portal. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error.message);
    throw new Error("Failed to send confirmation email");
  }
};
