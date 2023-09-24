export const signInEmailTemplate = `
<!DOCTYPE html>
<html>
<head>
    <style>
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .header {
            color: #26a4ff;
            text-align: center;
            padding: 1.5rem;
        }
        .header h1, .name{
            color: #26a4ff;
            font-weight: bold;
        }
        
        .content {
            padding:20px 0px;
        }
        .footer {
        text-align: center;
        padding: 1rem;
        color:#202430;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://vitejs.dev/logo-with-shadow.png" alt="Image" style="max-width:150px;">
            <h1>SignIn Notification</h1> 
        </div>
        <div class="content">
            <p>Hello <span class='name' > [User's Name]</span>,</p>
            <p>We wanted to inform you about a recent sign-in to your account using:</p>
                <p><strong>System:</strong> [Browser] on [Operating System]</p>
                <p><strong>Sign-In Time:</strong> [Sign-In Time]</p>
            <p>If you believe this sign-in was unauthorized or if you have any concerns about your account security, please <a href="[Support Link]">contact our support team</a> immediately.</p>
            <p>Thank you for using our services!</p>
        </div>
        <div class="footer">
            <p>&copy; 2023 Your <a href="https://m05.vercel.app/">GetJob</a>. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

export const signUpEmailTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .header {
            color: #26a4ff;
            text-align: center;
            padding: 1.5rem;
        }
        .header h1{
            color: #26a4ff;
            font-weight: bold;
        }
        .content {
            padding:20px 0px;
        }
        .footer {
            text-align: center;
            padding: 1rem;
            color:#202430;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://vitejs.dev/logo-with-shadow.png" alt="Image" style="max-width: 150px;">
            <h1>Welcome to our Job Portal</h1>
        </div>
        <div class="content">
            <h2>Discover more than 500+ jobs</h2>
            <p>Find your dream job today</p>
            <p>Explore thousands of job opportunities in the computer, engineering, and technology sectors.</p>
            <a href="https://m05.vercel.app/">Start Exploring</a>
        </div>
        <div class="footer">
            <p>&copy; 2023 Your <a href="https://m05.vercel.app/">GetJob</a>. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
export const ResetPasswordTemplate = `
<!DOCTYPE html>
<html lang="en">
<head>
    <style>
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
        }
        .header {
            color: #26a4ff;
            text-align: center;
            padding: 1.5rem;
        }
        .header h1{
            color: #26a4ff;
            font-weight: bold;
        }
        .content {
            padding:20px 0px;
        }
        .footer {
            text-align: center;
            padding: 1rem;
            color:#202430;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://vitejs.dev/logo-with-shadow.png" alt="Image" style="max-width: 150px;">
            <h1>Password Reset Request</h1>
        </div>
        <div class="content">
            <h2>Click the following link to reset your password:</h2>
            <a target="_blank" href="LINK">LINK</a>
        </div>
        <div class="footer">
            <p>&copy; 2023 Your <a href="https://m05.vercel.app/">GetJob</a>. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
