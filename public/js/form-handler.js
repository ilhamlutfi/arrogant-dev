// Toast bawaan SweetAlert2
const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: toast => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

// Fungsi untuk menampilkan error global dari server (422)
function alertErrors(responseText) {
  try {
    const resJSON = typeof responseText === 'string' ? JSON.parse(responseText) : responseText;
    const errors = resJSON.errors || {};
    let errorText = '';

    for (let key in errors) {
      if (errors[key]?.msg) {
        errorText = errors[key].msg;
        break;
      }
      if (typeof errors[key] === 'string') {
        errorText = errors[key];
        break;
      }
    }

    if (errorText) {
      Toast.fire({
        icon: 'error',
        title: 'Ops! Data Tidak Valid<br>' + errorText
      });
    }
  } catch (e) {
    console.error('Gagal parsing error:', e);
  }
}

window.FormHandler = class {
  constructor(selector, options = {}) {
    this.form = $(selector);
    this.rules = options.rules || {};
    this.url = options.url || this.form.attr('action') || window.location.pathname;
    this.method = options.method || this.form.attr('method') || 'POST';
    this.onSuccess = options.onSuccess || (() => {});
    this.clearOnSuccess = options.clearOnSuccess || false;
    this.showSuccessToast = options.showSuccessToast || false;
    this.customErrorHandler = options.customErrorHandler || null;
    this.loadingButton = this.form.find('button[type=submit]');

    this.init();
  }

  init() {
    const self = this;

    if (this.form.data('validator')) {
      this.form.validate('destroy');
    }

    const validateOptions = {
      highlight(el) {
        $(el).addClass('is-invalid').removeClass('is-valid');
      },
      unhighlight(el) {
        $(el).addClass('is-valid').removeClass('is-invalid');
      },
      errorPlacement(err, el) {
        const field = $(el).attr('name');
        $(`#error-${field}`).text(err.text());
      },
      submitHandler() {
        const formData = self.form.serialize();
        const action = self.url;

        self.setLoading(true);

        $.ajax({
          url: action,
          method: self.method,
          data: formData,
          success(res) {
            self.setLoading(false);
            self.resetValidation();

            if (self.clearOnSuccess) {
              self.form.trigger('reset');
              self.form.find('input, textarea, select').removeClass('is-valid is-invalid');
            }

            if (self.showSuccessToast && window.Swal) {
              Toast.fire({
                icon: res.icon || 'success',
                title: res.message || 'Berhasil disimpan!'
              });
            }

            self.onSuccess(res);
          },
          error(xhr) {
            self.setLoading(false);
            self.resetValidation();

            if (xhr.status === 422 && xhr.responseJSON?.errors) {
              const errors = xhr.responseJSON.errors;

              for (const field in errors) {
                const input = self.form.find(`[name="${field}"]`);
                input.addClass('is-invalid');
                $(`#error-${field}`).text(errors[field].msg);
              }

              alertErrors(xhr.responseJSON);

              if (self.customErrorHandler) {
                self.customErrorHandler(errors);
              }
            } else {
              const msg = xhr.responseJSON?.message || 'Terjadi kesalahan pada server.';
              if (window.Swal) {
                Swal.fire({
                  icon: 'error',
                  title: 'Gagal',
                  text: msg
                });
              } else {
                console.error(xhr.responseText);
              }
            }
          }
        });
      }
    };

    if (Object.keys(this.rules).length > 0) {
      validateOptions.rules = this.rules;
    }

    this.form.validate(validateOptions);
  }

  resetValidation() {
    this.form.find('input, textarea, select').removeClass('is-invalid is-valid');
    this.form.find('.invalid-feedback').text('');
  }

  setLoading(state) {
    if (state) {
      this.loadingButton.attr('disabled', true);
      this.loadingButton.html('<span class="spinner-border spinner-border-sm me-1"></span> Loading...');
    } else {
      this.loadingButton.attr('disabled', false);
      this.loadingButton.html(this.loadingButton.data('original-text') || 'Simpan');
    }
  }
};
