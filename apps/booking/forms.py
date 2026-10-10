from django import forms


class ProjectInquiryForm(forms.Form):
    name = forms.CharField(
        max_length=120,
        strip=True,
        error_messages={"required": "Please enter your name."},
        widget=forms.TextInput(attrs={"autocomplete": "name"}),
    )
    email = forms.EmailField(
        max_length=254,
        error_messages={
            "required": "Please enter your email address.",
            "invalid": "Enter a valid email address.",
        },
        widget=forms.EmailInput(attrs={"autocomplete": "email"}),
    )
    company = forms.CharField(
        required=False,
        max_length=120,
        strip=True,
        help_text="Optional.",
        widget=forms.TextInput(attrs={"autocomplete": "organization"}),
    )
    project_type = forms.ChoiceField(
        required=False,
        choices=(("", "Select a project type"), ("Other", "Other")),
    )
    budget = forms.CharField(
        required=False,
        max_length=160,
        strip=True,
        help_text="Optional. A rough range or “not sure yet” is enough.",
        widget=forms.TextInput(attrs={"autocomplete": "off"}),
    )
    timeline = forms.CharField(
        required=False,
        max_length=200,
        strip=True,
        help_text="Optional. Share your preferred timing; it can be discussed with the project scope.",
        widget=forms.TextInput(attrs={"autocomplete": "off"}),
    )
    message = forms.CharField(
        min_length=20,
        max_length=5_000,
        strip=True,
        label="Project details",
        help_text="A few sentences about the goal, who it is for, and where things stand is a helpful place to start.",
        error_messages={
            "required": "Please share a few details about your project.",
            "min_length": "Please add a little more detail (at least 20 characters).",
        },
        widget=forms.Textarea(attrs={"rows": 7, "autocomplete": "off"}),
    )
    website = forms.CharField(
        required=False,
        widget=forms.HiddenInput(attrs={"autocomplete": "off", "tabindex": "-1"}),
    )

    def __init__(self, *args, service_types=(), **kwargs):
        super().__init__(*args, **kwargs)
        types = list(dict.fromkeys(
            service.get("name", "").strip()
            for service in service_types
            if service.get("name", "").strip()
        ))
        self.fields["project_type"].choices = [
            ("", "Select a project type"),
            *((name, name) for name in types),
            ("Other", "Other"),
        ]

        field_errors = self.errors if self.is_bound else {}
        for name, field in self.fields.items():
            attrs = field.widget.attrs
            help_id = f"id_{name}-help" if field.help_text else ""
            error_id = f"id_{name}-errors" if field_errors.get(name) else ""
            described_by = " ".join(value for value in (help_id, error_id) if value)
            if described_by:
                attrs["aria-describedby"] = described_by
            if error_id:
                attrs["aria-invalid"] = "true"
