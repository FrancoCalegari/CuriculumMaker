// State management
let cvData = {
	personalInfo: {
		name: "",
		email: "",
		phone: "",
		address: "",
		summary: "",
	},
	photo: {
		data: null,
		shape: "circular",
		hasBorder: false,
		borderWidth: 3,
		borderColor: "#2563eb",
	},
	workExperience: [],
	education: [],
	skills: [],
	languages: [],
	accentColor: "#2563eb", // Default blue
};

// Initialize app
document.addEventListener("DOMContentLoaded", () => {
	// Register service worker
	if ("serviceWorker" in navigator) {
		navigator.serviceWorker
			.register("/sw.js")
			.then((reg) => console.log("Service Worker registered", reg))
			.catch((err) => console.error("Service Worker registration failed", err));
	}

	// Load data from localStorage
	loadFromLocalStorage();

	// Setup form submit handler
	document.getElementById("cvForm").addEventListener("submit", generatePDF);

	// Auto-save on input change
	document
		.getElementById("cvForm")
		.addEventListener("input", debounce(saveToLocalStorage, 1000));

	// Update preview on input change
	document
		.getElementById("cvForm")
		.addEventListener("input", debounce(updatePreview, 300));

	// Initialize with one entry of each type
	addWorkExperience();
	addEducation();
	addSkill();
	addLanguage();

	// Initial preview update
	setTimeout(updatePreview, 100);
});

// Work Experience Functions
function addWorkExperience() {
	const container = document.getElementById("workExperienceContainer");
	const index = container.children.length;

	const card = document.createElement("div");
	card.className = "entry-card";
	card.innerHTML = `
        <button type="button" class="btn-remove" onclick="removeEntry(this)">×</button>
        <div class="form-grid">
            <div class="form-group">
                <label>Puesto</label>
                <input type="text" name="work-position-${index}" placeholder="Desarrollador Web">
            </div>
            <div class="form-group">
                <label>Empresa</label>
                <input type="text" name="work-company-${index}" placeholder="Tech Company SA">
            </div>
            <div class="form-group">
                <label>Fecha Inicio</label>
                <input type="text" name="work-startDate-${index}" placeholder="Enero 2020">
            </div>
            <div class="form-group">
                <label>Fecha Fin</label>
                <input type="text" name="work-endDate-${index}" placeholder="Presente">
            </div>
            <div class="form-group full-width">
                <label>Descripción</label>
                <textarea name="work-description-${index}" rows="3" placeholder="Describe tus responsabilidades y logros..."></textarea>
            </div>
        </div>
    `;

	container.appendChild(card);
}

// Education Functions
function addEducation() {
	const container = document.getElementById("educationContainer");
	const index = container.children.length;

	const card = document.createElement("div");
	card.className = "entry-card";
	card.innerHTML = `
        <button type="button" class="btn-remove" onclick="removeEntry(this)">×</button>
        <div class="form-grid">
            <div class="form-group">
                <label>Título/Grado</label>
                <input type="text" name="edu-degree-${index}" placeholder="Licenciatura en Informática">
            </div>
            <div class="form-group">
                <label>Institución</label>
                <input type="text" name="edu-institution-${index}" placeholder="Universidad Nacional">
            </div>
            <div class="form-group">
                <label>Fecha Inicio</label>
                <input type="text" name="edu-startDate-${index}" placeholder="2016">
            </div>
            <div class="form-group">
                <label>Fecha Fin</label>
                <input type="text" name="edu-endDate-${index}" placeholder="2020">
            </div>
            <div class="form-group full-width">
                <label>Descripción</label>
                <textarea name="edu-description-${index}" rows="2" placeholder="Logros académicos, proyectos destacados..."></textarea>
            </div>
        </div>
    `;

	container.appendChild(card);
}

// Skills Functions
function addSkill() {
	const container = document.getElementById("skillsContainer");
	const index = container.children.length;

	const card = document.createElement("div");
	card.className = "entry-card";
	card.innerHTML = `
        <button type="button" class="btn-remove" onclick="removeEntry(this)">×</button>
        <div class="form-grid">
            <div class="form-group">
                <label>Habilidad</label>
                <input type="text" name="skill-name-${index}" placeholder="JavaScript">
            </div>
            <div class="form-group">
                <label>Nivel</label>
                <select name="skill-level-${index}">
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado" selected>Avanzado</option>
                    <option value="Experto">Experto</option>
                </select>
            </div>
        </div>
    `;

	container.appendChild(card);
}

// Languages Functions
function addLanguage() {
	const container = document.getElementById("languagesContainer");
	const index = container.children.length;

	const card = document.createElement("div");
	card.className = "entry-card";
	card.innerHTML = `
        <button type="button" class="btn-remove" onclick="removeEntry(this)">×</button>
        <div class="form-grid">
            <div class="form-group">
                <label>Idioma</label>
                <input type="text" name="lang-name-${index}" placeholder="Español">
            </div>
            <div class="form-group">
                <label>Nivel</label>
                <select name="lang-level-${index}">
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Nativo" selected>Nativo</option>
                </select>
            </div>
        </div>
    `;

	container.appendChild(card);
}

// Remove Entry
function removeEntry(button) {
	button.parentElement.remove();
	saveToLocalStorage();
	updatePreview();
}

// Photo Upload Functions
function handlePhotoUpload(event) {
	const file = event.target.files[0];
	if (!file) return;

	if (!file.type.startsWith("image/")) {
		showToast("Por favor selecciona un archivo de imagen válido", "error");
		return;
	}

	const reader = new FileReader();
	reader.onload = function (e) {
		// Ensure photo object exists
		if (!cvData.photo) {
			cvData.photo = {
				data: null,
				shape: "circular",
				hasBorder: false,
				borderWidth: 3,
				borderColor: "#2563eb",
			};
		}

		cvData.photo.data = e.target.result;

		// Show preview
		const photoPreview = document.getElementById("photoPreview");
		const photoImg = document.getElementById("photoImg");
		const photoUploadBtn = document.getElementById("photoUploadBtn");

		photoImg.src = e.target.result;
		photoPreview.style.display = "block";
		photoUploadBtn.style.display = "none";

		updatePhotoStyle();
		updatePreview();
		saveToLocalStorage();
	};
	reader.readAsDataURL(file);
}

function removePhoto() {
	// Ensure photo object exists
	if (!cvData.photo) {
		cvData.photo = {
			data: null,
			shape: "circular",
			hasBorder: false,
			borderWidth: 3,
			borderColor: "#2563eb",
		};
	}

	cvData.photo.data = null;

	const photoPreview = document.getElementById("photoPreview");
	const photoImg = document.getElementById("photoImg");
	const photoUploadBtn = document.getElementById("photoUploadBtn");
	const photoInput = document.getElementById("photoInput");

	photoImg.src = "";
	photoPreview.style.display = "none";
	photoUploadBtn.style.display = "flex";
	photoInput.value = "";

	updatePreview();
	saveToLocalStorage();
}

function updatePhotoStyle() {
	// Ensure photo object exists
	if (!cvData.photo) {
		cvData.photo = {
			data: null,
			shape: "circular",
			hasBorder: false,
			borderWidth: 3,
			borderColor: "#2563eb",
		};
	}

	const shape = document.getElementById("photoShape").value;
	const hasBorder = document.getElementById("photoBorderToggle").checked;
	const borderWidth = document.getElementById("borderWidth").value;
	const borderColor = document.getElementById("borderColor").value;

	cvData.photo.shape = shape;
	cvData.photo.hasBorder = hasBorder;
	cvData.photo.borderWidth = borderWidth;
	cvData.photo.borderColor = borderColor;

	// Update preview thumbnail
	const photoImg = document.getElementById("photoImg");
	if (photoImg && photoImg.src) {
		let borderRadius;
		switch (shape) {
			case "circular":
				borderRadius = "50%";
				break;
			case "rounded":
				borderRadius = "16px";
				break;
			case "square":
				borderRadius = "0";
				break;
		}

		photoImg.style.borderRadius = borderRadius;

		if (hasBorder) {
			photoImg.style.border = `${borderWidth}px solid ${borderColor}`;
		} else {
			photoImg.style.border = "none";
		}
	}

	// Show/hide border controls
	const borderControls = document.getElementById("borderControls");
	const borderColorControl = document.getElementById("borderColorControl");
	if (hasBorder) {
		borderControls.style.display = "flex";
		borderColorControl.style.display = "flex";
	} else {
		borderControls.style.display = "none";
		borderColorControl.style.display = "none";
	}

	updatePreview();
	saveToLocalStorage();
}

function updateBorderWidth(value) {
	document.getElementById("borderWidthValue").textContent = value;
	cvData.photo.borderWidth = value;
	updatePhotoStyle();
}

// Accent Color Functions
function updateAccentColor(color) {
	cvData.accentColor = color;

	// Update the color preview text
	document.getElementById("colorPreview").textContent = color;

	// Update preview
	updatePreview();
	saveToLocalStorage();
}

// Collect Form Data
function collectFormData() {
	const formData = new FormData(document.getElementById("cvForm"));

	// Personal Info
	cvData.personalInfo = {
		name: document.getElementById("name").value,
		email: document.getElementById("email").value,
		phone: document.getElementById("phone").value,
		address: document.getElementById("address").value,
		summary: document.getElementById("summary").value,
	};

	// Work Experience
	cvData.workExperience = [];
	const workCards = document.getElementById("workExperienceContainer").children;
	for (let i = 0; i < workCards.length; i++) {
		const position = formData.get(`work-position-${i}`);
		if (position) {
			cvData.workExperience.push({
				position: position,
				company: formData.get(`work-company-${i}`),
				startDate: formData.get(`work-startDate-${i}`),
				endDate: formData.get(`work-endDate-${i}`),
				description: formData.get(`work-description-${i}`),
			});
		}
	}

	// Education
	cvData.education = [];
	const eduCards = document.getElementById("educationContainer").children;
	for (let i = 0; i < eduCards.length; i++) {
		const degree = formData.get(`edu-degree-${i}`);
		if (degree) {
			cvData.education.push({
				degree: degree,
				institution: formData.get(`edu-institution-${i}`),
				startDate: formData.get(`edu-startDate-${i}`),
				endDate: formData.get(`edu-endDate-${i}`),
				description: formData.get(`edu-description-${i}`),
			});
		}
	}

	// Skills
	cvData.skills = [];
	const skillCards = document.getElementById("skillsContainer").children;
	for (let i = 0; i < skillCards.length; i++) {
		const name = formData.get(`skill-name-${i}`);
		if (name) {
			cvData.skills.push({
				name: name,
				level: formData.get(`skill-level-${i}`),
			});
		}
	}

	// Languages
	cvData.languages = [];
	const langCards = document.getElementById("languagesContainer").children;
	for (let i = 0; i < langCards.length; i++) {
		const name = formData.get(`lang-name-${i}`);
		if (name) {
			cvData.languages.push({
				name: name,
				level: formData.get(`lang-level-${i}`),
			});
		}
	}

	return cvData;
}

// Generate PDF
async function generatePDF(e) {
	e.preventDefault();

	const data = collectFormData();

	// Validate
	if (!data.personalInfo.name || !data.personalInfo.email) {
		showToast("Por favor completa el nombre y email", "error");
		return;
	}

	// Show loading
	document.getElementById("loadingOverlay").classList.add("active");

	try {
		// Get the accent color
		const accentColor = cvData.accentColor || "#2563eb";

		// Create a temporary container for PDF generation
		const pdfElement = document.createElement("div");
		pdfElement.style.width = "210mm"; // A4 width
		pdfElement.style.padding = "20px";
		pdfElement.style.backgroundColor = "white";
		pdfElement.style.fontFamily =
			"'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
		pdfElement.style.color = "#333";
		pdfElement.style.lineHeight = "1.6";

		// Generate photo HTML if exists
		let photoHTML = "";
		if (cvData.photo && cvData.photo.data) {
			let borderRadius;
			switch (cvData.photo.shape) {
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
			const border = cvData.photo.hasBorder
				? `border: ${cvData.photo.borderWidth}px solid ${cvData.photo.borderColor};`
				: "";

			photoHTML = `
				<div style="display: flex; justify-content: center; margin-bottom: 20px;">
					<img src="${cvData.photo.data}" 
						style="width: 120px; height: 120px; object-fit: cover; border-radius: ${borderRadius}; ${border}" 
						alt="Foto de perfil" />
				</div>
			`;
		}

		// Build the PDF HTML content
		pdfElement.innerHTML = `
			${photoHTML}
			
			<div style="text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid ${accentColor};">
				<h1 style="font-size: 32px; color: ${accentColor}; margin-bottom: 10px;">${data.personalInfo.name}</h1>
				<div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 15px; font-size: 14px; color: #666;">
					${data.personalInfo.email ? `<span>📧 ${data.personalInfo.email}</span>` : ""}
					${data.personalInfo.phone ? `<span>📱 ${data.personalInfo.phone}</span>` : ""}
					${data.personalInfo.address ? `<span>📍 ${data.personalInfo.address}</span>` : ""}
				</div>
			</div>
			
			${
				data.personalInfo.summary
					? `
				<div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid ${accentColor};">
					<p>${data.personalInfo.summary}</p>
				</div>
			`
					: ""
			}
			
			${
				data.workExperience && data.workExperience.length > 0
					? `
				<div style="margin-bottom: 25px;">
					<h2 style="font-size: 20px; color: ${accentColor}; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid ${accentColor}; text-transform: uppercase; letter-spacing: 1px;">EXPERIENCIA LABORAL</h2>
					${data.workExperience
						.map(
							(exp) => `
						<div style="margin-bottom: 20px; padding-left: 15px; border-left: 2px solid #e0e7ff;">
							<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
								<div style="font-size: 16px; font-weight: bold; color: ${accentColor};">${exp.position}</div>
								<div style="font-size: 12px; color: #6b7280; font-style: italic;">${exp.startDate} - ${exp.endDate || "Presente"}</div>
							</div>
							<div style="font-size: 14px; color: #4b5563; margin-bottom: 5px;">${exp.company}</div>
							${exp.description ? `<div style="font-size: 14px; color: #4b5563; margin-top: 8px;">${exp.description}</div>` : ""}
						</div>
					`,
						)
						.join("")}
				</div>
			`
					: ""
			}
			
			${
				data.education && data.education.length > 0
					? `
				<div style="margin-bottom: 25px;">
					<h2 style="font-size: 20px; color: ${accentColor}; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid ${accentColor}; text-transform: uppercase; letter-spacing: 1px;">EDUCACIÓN</h2>
					${data.education
						.map(
							(edu) => `
						<div style="margin-bottom: 20px; padding-left: 15px; border-left: 2px solid #e0e7ff;">
							<div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
								<div style="font-size: 16px; font-weight: bold; color: ${accentColor};">${edu.degree}</div>
								<div style="font-size: 12px; color: #6b7280; font-style: italic;">${edu.startDate} - ${edu.endDate || "Presente"}</div>
							</div>
							<div style="font-size: 14px; color: #4b5563; margin-bottom: 5px;">${edu.institution}</div>
							${edu.description ? `<div style="font-size: 14px; color: #4b5563; margin-top: 8px;">${edu.description}</div>` : ""}
						</div>
					`,
						)
						.join("")}
				</div>
			`
					: ""
			}
			
			${
				data.skills && data.skills.length > 0
					? `
				<div style="margin-bottom: 25px;">
					<h2 style="font-size: 20px; color: ${accentColor}; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid ${accentColor}; text-transform: uppercase; letter-spacing: 1px;">HABILIDADES</h2>
					<div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px;">
						${data.skills
							.map(
								(skill) => `
							<div style="display: flex; justify-content: space-between; padding: 8px; background: #f8fafc; border-radius: 5px; font-size: 14px;">
								<span style="font-weight: 500; color: #334155;">${skill.name}</span>
								<span style="color: #64748b; font-size: 12px;">${skill.level}</span>
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
				data.languages && data.languages.length > 0
					? `
				<div style="margin-bottom: 25px;">
					<h2 style="font-size: 20px; color: ${accentColor}; margin-bottom: 15px; padding-bottom: 8px; border-bottom: 2px solid ${accentColor}; text-transform: uppercase; letter-spacing: 1px;">IDIOMAS</h2>
					<div style="display: flex; flex-wrap: wrap; gap: 12px;">
						${data.languages
							.map(
								(lang) => `
							<div style="padding: 8px 15px; background: #f0f9ff; border-radius: 20px; font-size: 14px; color: #1e40af; border: 1px solid #bfdbfe;">
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
		`;

		// Generate PDF using html2pdf.js
		const opt = {
			margin: 10,
			filename: `CV_${data.personalInfo.name.replace(/\s+/g, "_")}.pdf`,
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: { scale: 2, useCORS: true },
			jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
		};

		await html2pdf().set(opt).from(pdfElement).save();

		showToast("¡PDF generado exitosamente!", "success");
	} catch (error) {
		console.error("Error:", error);
		showToast("Error al generar el PDF. Por favor intenta de nuevo.", "error");
	} finally {
		document.getElementById("loadingOverlay").classList.remove("active");
	}
}

// Export Data
function exportData() {
	const data = collectFormData();
	const dataStr = JSON.stringify(data, null, 2);
	const blob = new Blob([dataStr], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `CV_Data_${new Date().toISOString().split("T")[0]}.json`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);

	showToast("Datos exportados exitosamente", "success");
}

// Import Data
function importData(event) {
	const file = event.target.files[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = function (e) {
		try {
			const data = JSON.parse(e.target.result);
			loadDataToForm(data);
			cvData = data;
			saveToLocalStorage();
			showToast("Datos importados exitosamente", "success");
		} catch (error) {
			console.error("Error importing data:", error);
			showToast("Error al importar los datos", "error");
		}
	};
	reader.readAsText(file);

	// Reset file input
	event.target.value = "";
}

// Load Data to Form
function loadDataToForm(data) {
	// Personal Info
	if (data.personalInfo) {
		document.getElementById("name").value = data.personalInfo.name || "";
		document.getElementById("email").value = data.personalInfo.email || "";
		document.getElementById("phone").value = data.personalInfo.phone || "";
		document.getElementById("address").value = data.personalInfo.address || "";
		document.getElementById("summary").value = data.personalInfo.summary || "";
	}

	// Photo
	if (data.photo && data.photo.data) {
		cvData.photo = data.photo;

		// Restore photo preview
		const photoPreview = document.getElementById("photoPreview");
		const photoImg = document.getElementById("photoImg");
		const photoUploadBtn = document.getElementById("photoUploadBtn");

		photoImg.src = data.photo.data;
		photoPreview.style.display = "block";
		photoUploadBtn.style.display = "none";

		// Restore photo controls
		document.getElementById("photoShape").value =
			data.photo.shape || "circular";
		document.getElementById("photoBorderToggle").checked =
			data.photo.hasBorder || false;
		document.getElementById("borderWidth").value = data.photo.borderWidth || 3;
		document.getElementById("borderWidthValue").textContent =
			data.photo.borderWidth || 3;
		document.getElementById("borderColor").value =
			data.photo.borderColor || "#2563eb";

		updatePhotoStyle();
	} else {
		// Clear photo if not in data
		const photoPreview = document.getElementById("photoPreview");
		const photoUploadBtn = document.getElementById("photoUploadBtn");
		if (photoPreview) photoPreview.style.display = "none";
		if (photoUploadBtn) photoUploadBtn.style.display = "flex";
	}

	// Accent Color
	if (data.accentColor) {
		cvData.accentColor = data.accentColor;
		document.getElementById("accentColor").value = data.accentColor;
		document.getElementById("colorPreview").textContent = data.accentColor;
	}

	// Clear existing entries
	document.getElementById("workExperienceContainer").innerHTML = "";
	document.getElementById("educationContainer").innerHTML = "";
	document.getElementById("skillsContainer").innerHTML = "";
	document.getElementById("languagesContainer").innerHTML = "";

	// Work Experience
	if (data.workExperience && data.workExperience.length > 0) {
		data.workExperience.forEach((exp, i) => {
			addWorkExperience();
			const formData = new FormData();
			document.querySelector(`[name="work-position-${i}"]`).value =
				exp.position || "";
			document.querySelector(`[name="work-company-${i}"]`).value =
				exp.company || "";
			document.querySelector(`[name="work-startDate-${i}"]`).value =
				exp.startDate || "";
			document.querySelector(`[name="work-endDate-${i}"]`).value =
				exp.endDate || "";
			document.querySelector(`[name="work-description-${i}"]`).value =
				exp.description || "";
		});
	}

	// Education
	if (data.education && data.education.length > 0) {
		data.education.forEach((edu, i) => {
			addEducation();
			document.querySelector(`[name="edu-degree-${i}"]`).value =
				edu.degree || "";
			document.querySelector(`[name="edu-institution-${i}"]`).value =
				edu.institution || "";
			document.querySelector(`[name="edu-startDate-${i}"]`).value =
				edu.startDate || "";
			document.querySelector(`[name="edu-endDate-${i}"]`).value =
				edu.endDate || "";
			document.querySelector(`[name="edu-description-${i}"]`).value =
				edu.description || "";
		});
	}

	// Skills
	if (data.skills && data.skills.length > 0) {
		data.skills.forEach((skill, i) => {
			addSkill();
			document.querySelector(`[name="skill-name-${i}"]`).value =
				skill.name || "";
			document.querySelector(`[name="skill-level-${i}"]`).value =
				skill.level || "Intermedio";
		});
	}

	// Languages
	if (data.languages && data.languages.length > 0) {
		data.languages.forEach((lang, i) => {
			addLanguage();
			document.querySelector(`[name="lang-name-${i}"]`).value = lang.name || "";
			document.querySelector(`[name="lang-level-${i}"]`).value =
				lang.level || "Intermedio";
		});
	}

	// Update preview after loading data
	setTimeout(updatePreview, 100);
}

// LocalStorage Functions
function saveToLocalStorage() {
	const data = collectFormData();
	localStorage.setItem("cvMakerData", JSON.stringify(data));
}

function loadFromLocalStorage() {
	const savedData = localStorage.getItem("cvMakerData");
	if (savedData) {
		try {
			const data = JSON.parse(savedData);
			loadDataToForm(data);
			cvData = data;
		} catch (error) {
			console.error("Error loading from localStorage:", error);
		}
	}
}

// Clear Form
function clearForm() {
	if (
		confirm(
			"¿Estás seguro de que deseas limpiar el formulario? Esta acción no se puede deshacer.",
		)
	) {
		document.getElementById("cvForm").reset();
		document.getElementById("workExperienceContainer").innerHTML = "";
		document.getElementById("educationContainer").innerHTML = "";
		document.getElementById("skillsContainer").innerHTML = "";
		document.getElementById("languagesContainer").innerHTML = "";

		// Reset cv data
		cvData = {
			personalInfo: {},
			photo: {
				data: null,
				shape: "circular",
				hasBorder: false,
				borderWidth: 3,
				borderColor: "#2563eb",
			},
			workExperience: [],
			education: [],
			skills: [],
			languages: [],
			accentColor: "#2563eb",
		};

		// Clear photo
		const photoPreview = document.getElementById("photoPreview");
		const photoImg = document.getElementById("photoImg");
		const photoUploadBtn = document.getElementById("photoUploadBtn");
		const photoInput = document.getElementById("photoInput");

		if (photoImg) photoImg.src = "";
		if (photoPreview) photoPreview.style.display = "none";
		if (photoUploadBtn) photoUploadBtn.style.display = "flex";
		if (photoInput) photoInput.value = "";

		// Reset accent color
		document.getElementById("accentColor").value = "#2563eb";
		document.getElementById("colorPreview").textContent = "#2563eb";

		localStorage.removeItem("cvMakerData");

		// Add one entry of each
		addWorkExperience();
		addEducation();
		addSkill();
		addLanguage();

		showToast("Formulario limpiado", "success");
		updatePreview();
	}
}

// Toast Notification
function showToast(message, type = "success") {
	const toast = document.getElementById("toast");
	toast.textContent = message;
	toast.className = `toast ${type}`;
	toast.classList.add("show");

	setTimeout(() => {
		toast.classList.remove("show");
	}, 3000);
}

// Update Preview
function updatePreview() {
	const previewContainer = document.getElementById("cvPreview");
	if (!previewContainer) return; // Not on tool page

	const data = collectFormData();
	const { personalInfo, workExperience, education, skills, languages } = data;

	// Check if there's any content
	const hasContent =
		personalInfo.name ||
		personalInfo.email ||
		workExperience.length > 0 ||
		education.length > 0 ||
		skills.length > 0 ||
		languages.length > 0;

	if (!hasContent) {
		previewContainer.classList.remove("has-content");
		previewContainer.innerHTML = `
			<div class="preview-placeholder">
				<div class="placeholder-icon">👀</div>
				<p>La vista previa de tu CV aparecerá aquí</p>
				<p class="placeholder-hint">Completa el formulario para ver tu CV</p>
			</div>
		`;
		return;
	}

	previewContainer.classList.add("has-content");

	// Get accent color
	const accentColor = cvData.accentColor || "#2563eb";

	// Generate photo style
	let photoStyle = "";
	if (cvData.photo && cvData.photo.data) {
		let borderRadius;
		switch (cvData.photo.shape) {
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

		const border = cvData.photo.hasBorder
			? `border: ${cvData.photo.borderWidth}px solid ${cvData.photo.borderColor};`
			: "";

		photoStyle = `border-radius: ${borderRadius}; ${border}`;
	}

	// Generate preview HTML
	let html = `
		${
			cvData.photo && cvData.photo.data
				? `
			<div class="cv-photo-container">
				<img src="${cvData.photo.data}" class="cv-photo ${cvData.photo.shape}" style="${photoStyle}" alt="Foto de perfil" />
			</div>
		`
				: ""
		}
		
		<div class="cv-header" style="border-bottom-color: ${accentColor};">
			<h1 style="color: ${accentColor};">${personalInfo.name || "Tu Nombre"}</h1>
			<div class="cv-contact-info">
				${personalInfo.email ? `<span>📧 ${personalInfo.email}</span>` : ""}
				${personalInfo.phone ? `<span>📱 ${personalInfo.phone}</span>` : ""}
				${personalInfo.address ? `<span>📍 ${personalInfo.address}</span>` : ""}
			</div>
		</div>
		
		${
			personalInfo.summary
				? `
			<div class="cv-profile-summary" style="border-left-color: ${accentColor};">
				<p>${personalInfo.summary}</p>
			</div>
		`
				: ""
		}
		
		${
			workExperience && workExperience.length > 0
				? `
			<div class="cv-section">
				<h2 class="cv-section-title" style="color: ${accentColor}; border-bottom-color: ${accentColor};">Experiencia Laboral</h2>
				${workExperience
					.map(
						(exp) => `
					<div class="cv-entry">
						<div class="cv-entry-header">
							<div class="cv-entry-title" style="color: ${accentColor};">${exp.position}</div>
							<div class="cv-entry-date">${exp.startDate} - ${exp.endDate || "Presente"}</div>
						</div>
						<div class="cv-entry-subtitle">${exp.company}</div>
						${exp.description ? `<div class="cv-entry-description">${exp.description}</div>` : ""}
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
			<div class="cv-section">
				<h2 class="cv-section-title" style="color: ${accentColor}; border-bottom-color: ${accentColor};">Educación</h2>
				${education
					.map(
						(edu) => `
					<div class="cv-entry">
						<div class="cv-entry-header">
							<div class="cv-entry-title" style="color: ${accentColor};">${edu.degree}</div>
							<div class="cv-entry-date">${edu.startDate} - ${edu.endDate || "Presente"}</div>
						</div>
						<div class="cv-entry-subtitle">${edu.institution}</div>
						${edu.description ? `<div class="cv-entry-description">${edu.description}</div>` : ""}
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
			<div class="cv-section">
				<h2 class="cv-section-title" style="color: ${accentColor}; border-bottom-color: ${accentColor};">Habilidades</h2>
				<div class="cv-skills-grid">
					${skills
						.map(
							(skill) => `
						<div class="cv-skill-item">
							<span class="cv-skill-name">${skill.name}</span>
							<span class="cv-skill-level">${skill.level}</span>
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
			<div class="cv-section">
				<h2 class="cv-section-title" style="color: ${accentColor}; border-bottom-color: ${accentColor};">Idiomas</h2>
				<div class="cv-languages-list">
					${languages
						.map(
							(lang) => `
						<div class="cv-language-item">
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
	`;

	previewContainer.innerHTML = html;
}

// Debounce utility
function debounce(func, wait) {
	let timeout;
	return function executedFunction(...args) {
		const later = () => {
			clearTimeout(timeout);
			func(...args);
		};
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
	};
}
