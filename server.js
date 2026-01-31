const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Puppeteer setup for different environments
let puppeteer;
let chromium;

// Try to use Vercel-compatible version
try {
	puppeteer = require("puppeteer-core");
	chromium = require("@sparticuz/chromium");
} catch (err) {
	// Fallback to regular puppeteer for local development
	puppeteer = require("puppeteer");
}

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.static("public"));

// API endpoint to generate PDF
app.post("/api/generate-pdf", async (req, res) => {
	try {
		const cvData = req.body;

		// Generate HTML from template
		const htmlContent = generateCVHTML(cvData);

		// Launch Puppeteer with appropriate configuration
		let browser;
		if (chromium) {
			// Vercel/serverless environment
			browser = await puppeteer.launch({
				args: [
					...chromium.args,
					"--disable-gpu",
					"--disable-dev-shm-usage",
					"--disable-setuid-sandbox",
					"--no-first-run",
					"--no-sandbox",
					"--no-zygote",
					"--single-process",
				],
				defaultViewport: chromium.defaultViewport,
				executablePath: await chromium.executablePath(),
				headless: chromium.headless || "new",
				ignoreHTTPSErrors: true,
			});
		} else {
			// Local development
			browser = await puppeteer.launch({
				headless: "new",
				args: ["--no-sandbox", "--disable-setuid-sandbox"],
			});
		}

		const page = await browser.newPage();
		await page.setContent(htmlContent, { waitUntil: "networkidle0" });

		// Generate PDF
		const pdfBuffer = await page.pdf({
			format: "A4",
			printBackground: true,
			margin: {
				top: "20px",
				right: "20px",
				bottom: "20px",
				left: "20px",
			},
		});

		await browser.close();

		// Send PDF as response
		res.setHeader("Content-Type", "application/pdf");
		res.setHeader(
			"Content-Disposition",
			`attachment; filename="CV_${cvData.personalInfo.name.replace(/\s+/g, "_")}.pdf"`,
		);
		res.send(pdfBuffer);
	} catch (error) {
		console.error("Error generating PDF:", error);
		res
			.status(500)
			.json({ error: "Failed to generate PDF", details: error.message });
	}
});

// Function to generate HTML for CV
function generateCVHTML(data) {
	const { personalInfo, workExperience, education, skills, languages } = data;
	const accentColor = data.accentColor || "#2563eb";

	return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>CV - ${personalInfo.name}</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                color: #333;
                line-height: 1.6;
                background: #fff;
            }
            
            .cv-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 40px;
            }
            
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 3px solid ${accentColor};
            }
            
            .header h1 {
                font-size: 32px;
                color: ${accentColor};
                margin-bottom: 10px;
            }
            
            .contact-info {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 15px;
                font-size: 14px;
                color: #666;
            }
            
            .contact-info span {
                display: inline-flex;
                align-items: center;
            }
            
            .profile-summary {
                background: #f0f9ff;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 25px;
                border-left: 4px solid ${accentColor};
            }
            
            .section {
                margin-bottom: 25px;
            }
            
            .section-title {
                font-size: 20px;
                color: ${accentColor};
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 2px solid ${accentColor};
                text-transform: uppercase;
                letter-spacing: 1px;
            }
            
            .entry {
                margin-bottom: 20px;
                padding-left: 15px;
                border-left: 2px solid #e0e7ff;
            }
            
            .entry-header {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                margin-bottom: 8px;
            }
            
            .entry-title {
                font-size: 16px;
                font-weight: bold;
                color: ${accentColor};
            }
            
            .entry-subtitle {
                font-size: 14px;
                color: #4b5563;
                margin-bottom: 5px;
            }
            
            .entry-date {
                font-size: 12px;
                color: #6b7280;
                font-style: italic;
            }
            
            .entry-description {
                font-size: 14px;
                color: #4b5563;
                margin-top: 8px;
            }
            
            .skills-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }
            
            .skill-item {
                display: flex;
                justify-content: space-between;
                padding: 8px;
                background: #f8fafc;
                border-radius: 5px;
                font-size: 14px;
            }
            
            .skill-name {
                font-weight: 500;
                color: #334155;
            }
            
            .skill-level {
                color: #64748b;
                font-size: 12px;
            }
            
            .languages-list {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
            }
            
            .language-item {
                padding: 8px 15px;
                background: #f0f9ff;
                border-radius: 20px;
                font-size: 14px;
                color: #1e40af;
                border: 1px solid #bfdbfe;
            }
            
            .photo-container {
                display: flex;
                justify-content: center;
                margin-bottom: 20px;
            }
            
            .cv-photo {
                width: 120px;
                height: 120px;
                object-fit: cover;
            }
        </style>
    </head>
    <body>
        <div class="cv-container">
            ${
							data.photo && data.photo.data
								? `
            <div class="photo-container">
                <img src="${data.photo.data}" class="cv-photo" style="${generatePhotoStyle(data.photo)}" alt="Foto de perfil" />
            </div>
            `
								: ""
						}
            
            <div class="header">
                <h1>${personalInfo.name}</h1>
                <div class="contact-info">
                    ${personalInfo.email ? `<span>📧 ${personalInfo.email}</span>` : ""}
                    ${personalInfo.phone ? `<span>📱 ${personalInfo.phone}</span>` : ""}
                    ${personalInfo.address ? `<span>📍 ${personalInfo.address}</span>` : ""}
                </div>
            </div>
            
            ${
							personalInfo.summary
								? `
            <div class="profile-summary">
                <p>${personalInfo.summary}</p>
            </div>
            `
								: ""
						}
            
            ${
							workExperience && workExperience.length > 0
								? `
            <div class="section">
                <h2 class="section-title">Experiencia Laboral</h2>
                ${workExperience
									.map(
										(exp) => `
                    <div class="entry">
                        <div class="entry-header">
                            <div class="entry-title">${exp.position}</div>
                            <div class="entry-date">${exp.startDate} - ${exp.endDate || "Presente"}</div>
                        </div>
                        <div class="entry-subtitle">${exp.company}</div>
                        ${exp.description ? `<div class="entry-description">${exp.description}</div>` : ""}
                    </div>
                `,
									)
									.join("")}
            </div>
            `
								: ""
						}
            
            ${
							education && education.length > 0
								? `
            <div class="section">
                <h2 class="section-title">Educación</h2>
                ${education
									.map(
										(edu) => `
                    <div class="entry">
                        <div class="entry-header">
                            <div class="entry-title">${edu.degree}</div>
                            <div class="entry-date">${edu.startDate} - ${edu.endDate || "Presente"}</div>
                        </div>
                        <div class="entry-subtitle">${edu.institution}</div>
                        ${edu.description ? `<div class="entry-description">${edu.description}</div>` : ""}
                    </div>
                `,
									)
									.join("")}
            </div>
            `
								: ""
						}
            
            ${
							skills && skills.length > 0
								? `
            <div class="section">
                <h2 class="section-title">Habilidades</h2>
                <div class="skills-grid">
                    ${skills
											.map(
												(skill) => `
                        <div class="skill-item">
                            <span class="skill-name">${skill.name}</span>
                            <span class="skill-level">${skill.level}</span>
                        </div>
                    `,
											)
											.join("")}
                </div>
            </div>
            `
								: ""
						}
            
            ${
							languages && languages.length > 0
								? `
            <div class="section">
                <h2 class="section-title">Idiomas</h2>
                <div class="languages-list">
                    ${languages
											.map(
												(lang) => `
                        <div class="language-item">
                            ${lang.name} - ${lang.level}
                        </div>
                    `,
											)
											.join("")}
                </div>
            </div>
            `
								: ""
						}
        </div>
    </body>
    </html>
    `;
}

// Helper function to generate photo style
function generatePhotoStyle(photo) {
	if (!photo || !photo.data) return "";

	let borderRadius;
	switch (photo.shape) {
		case "circular":
			borderRadius = "50%";
			break;
		case "rounded":
			borderRadius = "16px";
			break;
		case "square":
			borderRadius = "0";
			break;
		default:
			borderRadius = "50%";
	}

	const border = photo.hasBorder
		? `border: ${photo.borderWidth}px solid ${photo.borderColor};`
		: "";

	return `border-radius: ${borderRadius}; ${border}`;
}

// Start server
app.listen(PORT, () => {
	console.log(`✅ Server running on http://localhost:${PORT}`);
});
