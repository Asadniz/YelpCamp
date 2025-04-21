window.addEventListener('load', function () {
    const forms = document.querySelectorAll('.needsValidation');
    Array.from(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (form.checkValidity() === false) {
                event.preventDefault();
                event.stopPropagation();
                form.classList.add('was-validated');
            }
        })
    })
})