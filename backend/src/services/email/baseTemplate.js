export const baseTemplate = ({
    title,
    heading,
    content,
}) => {
    return `
        <div
            style="
                font-family: Arial, sans-serif;
                background:#f4f4f4;
                padding:40px;
            "
        >

            <div
                style="
                    max-width:650px;
                    margin:auto;
                    background:#ffffff;
                    border-radius:8px;
                    overflow:hidden;
                "
            >

                <div
                    style="
                        background:#111827;
                        color:white;
                        padding:25px;
                        text-align:center;
                    "
                >
                    <h1 style="margin:0;">
                        AutoNex
                    </h1>

                    <p style="margin-top:8px;">
                        ${title}
                    </p>
                </div>

                <div style="padding:30px;">

                    <h2>${heading}</h2>

                    ${content}

                </div>

                <div
                    style="
                        background:#f5f5f5;
                        padding:20px;
                        text-align:center;
                        color:#666;
                        font-size:12px;
                    "
                >

                    © ${new Date().getFullYear()} AutoNex

                    <br>

                    Thank you for choosing us.

                </div>

            </div>

        </div>
    `;
};