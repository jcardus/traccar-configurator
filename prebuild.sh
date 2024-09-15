#!/bin/bash

if [ -n "${LOGO_URL}" ]; then
  curl "${LOGO_URL}" > static/logo.png
fi

pwa-assets-generator --preset minimal static/logo.png
