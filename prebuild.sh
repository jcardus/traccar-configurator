#!/bin/bash

if [ -n "${LOGO_URL}" ]; then
  curl "${LOGO_URL}" > static/logo.svg
fi

pwa-assets-generator --preset minimal static/logo.svg
