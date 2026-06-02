function emailTemplate(title, msg, otp) {
    return `
    <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: 40px auto;
        padding: 30px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        color: #333;
    ">

        <h2 style="
            margin: 0 0 20px 0;
            font-weight: 600;
        ">
            ${title}
        </h2>

        <p style="
            font-size: 15px;
            line-height: 1.6;
            color: #555;
        ">
            ${msg}
        </p>

        <div style="
            text-align: center;
            margin: 30px 0;
        ">
            <span style="
                display: inline-block;
                background: #f5f5f5;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                color: #111;
            ">
                ${otp}
            </span>
        </div>

        <p style="
            font-size: 14px;
            color: #666;
            text-align: center;
        ">
            This OTP will expire in <strong>5 minutes</strong>.
        </p>

        <hr style="
            border: none;
            border-top: 1px solid #eee;
            margin: 25px 0;
        ">

        <p style="
            font-size: 12px;
            color: #888;
            text-align: center;
            line-height: 1.5;
        ">
            If you didn't request this code, you can safely ignore this email.
        </p>

    </div>
    `;
}

function bookingConfirmationTemplate(userName, eventTitle) {
    return `
    <div style="
        font-family: Arial, sans-serif;
        max-width: 500px;
        margin: 40px auto;
        padding: 30px;
        border: 1px solid #e5e7eb;
        border-radius: 12px;
        color: #333;
    ">

        <h2 style="
            margin: 0 0 20px 0;
            font-weight: 600;
            text-align: center;
        ">
            Booking Confirmed 🎉
        </h2>

        <p style="
            font-size: 15px;
            color: #555;
            line-height: 1.6;
        ">
            Hello ${userName},
        </p>

        <p style="
            font-size: 15px;
            color: #555;
            line-height: 1.6;
        ">
            Your booking has been successfully confirmed for:
        </p>

        <div style="
            text-align: center;
            margin: 30px 0;
        ">
            <span style="
                display: inline-block;
                background: #f5f5f5;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 22px;
                font-weight: 600;
                color: #111;
            ">
                ${eventTitle}
            </span>
        </div>

        <p style="
            font-size: 14px;
            color: #666;
            text-align: center;
        ">
            We look forward to seeing you at the event.
        </p>

        <hr style="
            border: none;
            border-top: 1px solid #eee;
            margin: 25px 0;
        ">

        <p style="
            font-size: 12px;
            color: #888;
            text-align: center;
        ">
            This is an automated confirmation email.
        </p>

    </div>
    `;
}

module.exports = {
    emailTemplate,
    bookingConfirmationTemplate
};