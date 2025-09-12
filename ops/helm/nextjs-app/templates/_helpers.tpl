{{- define "nextjs-app.name" -}}
{{- .Chart.Name -}}
{{- end -}}

{{- define "nextjs-app.fullname" -}}
{{- printf "%s-%s" .Release.Name (include "nextjs-app.name" .) | trunc 63 | trimSuffix "-" -}}
{{- end -}}
