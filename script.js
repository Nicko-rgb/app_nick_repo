// Variables globales
let currentDate = new Date();
let selectedDate = null;
let selectedSlots = [];
let currentEstablishment = '';

// Datos de ejemplo para horarios
const timeSlots = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00',
    '14:00', '15:00', '16:00', '17:00', '18:00', '19:00',
    '20:00', '21:00', '22:00'
];

// Horarios ocupados (simulación)
const unavailableSlots = {
    '2024-01-15': ['10:00', '11:00', '15:00'],
    '2024-01-16': ['09:00', '14:00', '16:00', '17:00'],
    '2024-01-17': ['12:00', '13:00', '18:00']
};

// Precios por hora para cada establecimiento
const establishmentPrices = {
    'Centro Deportivo El Campeón': 80,
    'Gimnasio Basketball Pro': 60,
    'Club de Tenis Elite': 45,
    'FitZone Gym': 35,
    'Voleibol Arena': 55,
    'Complejo Deportivo La Cancha': 70
};

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeFilters();
    initializeCalendar();
    initializeModal();
});

// Navegación móvil
function initializeNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Smooth scrolling para enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Filtros de establecimientos
function initializeFilters() {
    const sportFilter = document.getElementById('sport-filter');
    const ratingFilter = document.getElementById('rating-filter');
    const priceFilter = document.getElementById('price-filter');
    
    if (sportFilter) {
        sportFilter.addEventListener('change', applyFilters);
    }
    if (ratingFilter) {
        ratingFilter.addEventListener('change', applyFilters);
    }
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    const sportFilter = document.getElementById('sport-filter')?.value || '';
    const ratingFilter = parseFloat(document.getElementById('rating-filter')?.value) || 0;
    const priceFilter = parseFloat(document.getElementById('price-filter')?.value) || Infinity;
    
    const cards = document.querySelectorAll('.establishment-card');
    
    cards.forEach(card => {
        const cardSport = card.dataset.sport || '';
        const cardRating = parseFloat(card.dataset.rating) || 0;
        const cardPrice = parseFloat(card.dataset.price) || 0;
        
        let show = true;
        
        // Filtro por deporte
        if (sportFilter && cardSport !== sportFilter) {
            show = false;
        }
        
        // Filtro por calificación
        if (ratingFilter && cardRating < ratingFilter) {
            show = false;
        }
        
        // Filtro por precio
        if (priceFilter !== Infinity && cardPrice > priceFilter) {
            show = false;
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}

// Sistema de reservas
function openReservation(establishmentName) {
    currentEstablishment = establishmentName;
    const modal = document.getElementById('reservation-modal');
    const modalTitle = document.getElementById('modal-title');
    
    if (modal && modalTitle) {
        modalTitle.textContent = `Reservar - ${establishmentName}`;
        modal.style.display = 'block';
        
        // Reset estado
        selectedDate = null;
        selectedSlots = [];
        document.getElementById('time-slots').style.display = 'none';
        document.getElementById('reservation-summary').style.display = 'none';
        
        // Generar calendario
        generateCalendar();
    }
}

function closeReservation() {
    const modal = document.getElementById('reservation-modal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Cerrar modal al hacer clic fuera
window.addEventListener('click', function(event) {
    const modal = document.getElementById('reservation-modal');
    if (event.target === modal) {
        closeReservation();
    }
});

// Inicializar calendario
function initializeCalendar() {
    const prevBtn = document.getElementById('prev-month');
    const nextBtn = document.getElementById('next-month');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() - 1);
            generateCalendar();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            currentDate.setMonth(currentDate.getMonth() + 1);
            generateCalendar();
        });
    }
}

function generateCalendar() {
    const calendar = document.getElementById('calendar');
    const currentMonthElement = document.getElementById('current-month');
    
    if (!calendar || !currentMonthElement) return;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Actualizar título del mes
    const monthNames = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    currentMonthElement.textContent = `${monthNames[month]} ${year}`;
    
    // Limpiar calendario
    calendar.innerHTML = '';
    
    // Agregar encabezados de días
    const dayHeaders = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    dayHeaders.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-header-day';
        dayElement.textContent = day;
        calendar.appendChild(dayElement);
    });
    
    // Primer día del mes y último día
    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    
    // Días del mes anterior
    const prevMonth = new Date(year, month, 0);
    const prevLastDate = prevMonth.getDate();
    
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month disabled';
        dayElement.textContent = prevLastDate - i;
        calendar.appendChild(dayElement);
    }
    
    // Días del mes actual
    for (let date = 1; date <= lastDate; date++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day';
        dayElement.textContent = date;
        
        const currentDateObj = new Date(year, month, date);
        
        // Deshabilitar días pasados
        if (currentDateObj < today.setHours(0, 0, 0, 0)) {
            dayElement.classList.add('disabled');
        } else {
            dayElement.addEventListener('click', function() {
                selectDate(year, month, date);
            });
        }
        
        calendar.appendChild(dayElement);
    }
    
    // Días del mes siguiente para completar la grilla
    const totalCells = calendar.children.length;
    const remainingCells = 42 - totalCells; // 6 semanas × 7 días
    
    for (let date = 1; date <= remainingCells; date++) {
        const dayElement = document.createElement('div');
        dayElement.className = 'calendar-day other-month disabled';
        dayElement.textContent = date;
        calendar.appendChild(dayElement);
    }
}

function selectDate(year, month, date) {
    // Remover selección anterior
    document.querySelectorAll('.calendar-day.selected').forEach(day => {
        day.classList.remove('selected');
    });
    
    // Seleccionar nuevo día
    event.target.classList.add('selected');
    
    selectedDate = new Date(year, month, date);
    const dateString = selectedDate.toISOString().split('T')[0];
    
    // Mostrar horarios
    showTimeSlots(dateString);
}

function showTimeSlots(dateString) {
    const timeSlotsContainer = document.getElementById('time-slots');
    const slotsGrid = document.getElementById('slots-grid');
    const selectedDateElement = document.getElementById('selected-date');
    
    if (!timeSlotsContainer || !slotsGrid || !selectedDateElement) return;
    
    // Formatear fecha para mostrar
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    selectedDateElement.textContent = selectedDate.toLocaleDateString('es-ES', options);
    
    // Limpiar slots anteriores
    slotsGrid.innerHTML = '';
    selectedSlots = [];
    
    // Generar slots de tiempo
    timeSlots.forEach(time => {
        const slotElement = document.createElement('div');
        slotElement.className = 'time-slot';
        slotElement.textContent = time;
        
        // Verificar si está ocupado
        const unavailable = unavailableSlots[dateString]?.includes(time);
        
        if (unavailable) {
            slotElement.classList.add('unavailable');
            slotElement.title = 'No disponible';
        } else {
            slotElement.addEventListener('click', function() {
                toggleTimeSlot(time, slotElement);
            });
        }
        
        slotsGrid.appendChild(slotElement);
    });
    
    timeSlotsContainer.style.display = 'block';
    document.getElementById('reservation-summary').style.display = 'none';
}

function toggleTimeSlot(time, element) {
    const index = selectedSlots.indexOf(time);
    
    if (index > -1) {
        // Deseleccionar
        selectedSlots.splice(index, 1);
        element.classList.remove('selected');
    } else {
        // Seleccionar
        selectedSlots.push(time);
        element.classList.add('selected');
    }
    
    // Ordenar slots seleccionados
    selectedSlots.sort();
    
    // Mostrar resumen si hay slots seleccionados
    if (selectedSlots.length > 0) {
        showReservationSummary();
    } else {
        document.getElementById('reservation-summary').style.display = 'none';
    }
}

function showReservationSummary() {
    const summaryContainer = document.getElementById('reservation-summary');
    const summaryDetails = document.getElementById('summary-details');
    
    if (!summaryContainer || !summaryDetails) return;
    
    const pricePerHour = establishmentPrices[currentEstablishment] || 50;
    const totalHours = selectedSlots.length;
    const totalPrice = totalHours * pricePerHour;
    
    const dateString = selectedDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    summaryDetails.innerHTML = `
        <div class="summary-item">
            <span>Establecimiento:</span>
            <span>${currentEstablishment}</span>
        </div>
        <div class="summary-item">
            <span>Fecha:</span>
            <span>${dateString}</span>
        </div>
        <div class="summary-item">
            <span>Horarios:</span>
            <span>${selectedSlots.join(', ')}</span>
        </div>
        <div class="summary-item">
            <span>Duración:</span>
            <span>${totalHours} hora${totalHours > 1 ? 's' : ''}</span>
        </div>
        <div class="summary-item">
            <span>Precio por hora:</span>
            <span>$${pricePerHour}</span>
        </div>
        <div class="summary-item">
            <span>Total:</span>
            <span>$${totalPrice}</span>
        </div>
    `;
    
    summaryContainer.style.display = 'block';
}

function confirmReservation() {
    if (selectedSlots.length === 0) {
        alert('Por favor selecciona al menos un horario.');
        return;
    }
    
    // Simular confirmación de reserva
    const confirmation = confirm(`¿Confirmar reserva en ${currentEstablishment} para el ${selectedDate.toLocaleDateString('es-ES')} en los horarios ${selectedSlots.join(', ')}?`);
    
    if (confirmation) {
        // Aquí se enviaría la reserva al servidor
        alert('¡Reserva confirmada! Recibirás un email de confirmación.');
        
        // Marcar horarios como ocupados (simulación)
        const dateString = selectedDate.toISOString().split('T')[0];
        if (!unavailableSlots[dateString]) {
            unavailableSlots[dateString] = [];
        }
        unavailableSlots[dateString].push(...selectedSlots);
        
        closeReservation();
    }
}

// Inicializar modal
function initializeModal() {
    // Cerrar modal con tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeReservation();
        }
    });
}

// Animaciones y efectos
function addScrollEffects() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observar elementos para animación
    document.querySelectorAll('.establishment-card, .feature-card, .sport-item').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Ejecutar efectos de scroll cuando la página esté cargada
window.addEventListener('load', addScrollEffects);

// Función para búsqueda en tiempo real (si se implementa)
function searchEstablishments(query) {
    const cards = document.querySelectorAll('.establishment-card');
    const searchTerm = query.toLowerCase();
    
    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const features = Array.from(card.querySelectorAll('.feature')).map(f => f.textContent.toLowerCase()).join(' ');
        const amenities = Array.from(card.querySelectorAll('.amenity')).map(a => a.textContent.toLowerCase()).join(' ');
        
        const searchContent = `${title} ${features} ${amenities}`;
        
        if (searchContent.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Función para validar formularios (si se implementa)
function validateForm(formData) {
    const errors = [];
    
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('El nombre debe tener al menos 2 caracteres');
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.push('Email inválido');
    }
    
    if (!formData.phone || !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
        errors.push('Teléfono inválido');
    }
    
    return errors;
}

// Función para manejar errores
function handleError(error) {
    console.error('Error:', error);
    alert('Ha ocurrido un error. Por favor intenta nuevamente.');
}

// Función para mostrar notificaciones
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 10px;
        color: white;
        font-weight: 600;
        z-index: 3000;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    if (type === 'success') {
        notification.style.background = '#4caf50';
    } else if (type === 'error') {
        notification.style.background = '#f44336';
    } else {
        notification.style.background = '#2196f3';
    }
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Ocultar después de 3 segundos
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Función para formatear precios
function formatPrice(price) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'USD'
    }).format(price);
}

// Función para formatear fechas
function formatDate(date) {
    return new Intl.DateTimeFormat('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Exportar funciones para uso global
window.openReservation = openReservation;
window.closeReservation = closeReservation;
window.confirmReservation = confirmReservation;
window.searchEstablishments = searchEstablishments;
window.showNotification = showNotification;