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

    // Hapus validator lama (prevent duplikat)
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
              Swal.fire({
                icon: res.icon || 'success',
                title: res.title || 'Berhasil',
                text: res.message || 'Berhasil disimpan!',
                toast: true,
                position: 'top-end',
                timer: 2000,
                showConfirmButton: false
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

    // Jalankan validasi hanya jika ada rules
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
