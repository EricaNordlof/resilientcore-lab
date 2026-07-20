'use strict';

const stateUrl = './network-state.json';

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function loadState() {
  const response = await fetch(stateUrl, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Could not load network state (${response.status})`);
  }
  return response.json();
}

function metric(label, value) {
  return `
    <article class="metric">
      <strong>${escapeHtml(value)}</strong>
      <span>${escapeHtml(label)}</span>
    </article>
  `;
}

function renderLoadingState() {
  const metrics = document.getElementById('metrics');
  const services = document.getElementById('services');
  const incident = document.getElementById('incident');

  if (metrics) {
    metrics.innerHTML = [
      metric('Nodes operational', '…'),
      metric('VPNv4 sessions', '…'),
      metric('Healthy services', '…'),
      metric('Average CPU', '…')
    ].join('');
  }

  if (services) {
    services.innerHTML = '<p class="loading-copy">Loading service state…</p>';
  }

  if (incident) {
    incident.innerHTML = '<p class="loading-copy">Loading incident data…</p>';
  }
}

function setLabStatus(healthy, label) {
  const status = document.getElementById('labStatus');
  if (!status) return;

  status.classList.toggle('status-error', !healthy);
  status.innerHTML = `<i aria-hidden="true"></i><span>${escapeHtml(label)}</span>`;
}

function renderState(data) {
  const nodes = Array.isArray(data.nodes) ? data.nodes : [];
  const services = Array.isArray(data.services) ? data.services : [];
  const incidents = Array.isArray(data.incidents) ? data.incidents : [];

  if (!nodes.length) {
    throw new Error('Network state contains no nodes');
  }

  const up = nodes.filter((node) => node.status === 'up').length;
  const peNodes = nodes.filter((node) => node.role === 'PE');
  const established = peNodes.filter(
    (node) => node.bgp_vpnv4 === 'established'
  ).length;
  const healthyServices = services.filter(
    (service) => service.status === 'healthy'
  ).length;
  const averageCpu = Math.round(
    nodes.reduce((total, node) => total + Number(node.cpu || 0), 0) / nodes.length
  );

  const metrics = document.getElementById('metrics');
  if (metrics) {
    metrics.innerHTML = [
      metric('Nodes operational', `${up}/${nodes.length}`),
      metric('VPNv4 sessions', `${established}/${peNodes.length}`),
      metric('Healthy services', `${healthyServices}/${services.length}`),
      metric('Average CPU', `${averageCpu}%`)
    ].join('');
  }

  const servicesElement = document.getElementById('services');
  if (servicesElement) {
    servicesElement.innerHTML = services.length
      ? services
          .map(
            (service) => `
              <div class="row">
                <div>
                  <strong>${escapeHtml(service.name)}</strong><br>
                  <span>Primary: ${escapeHtml(service.primary_path)}</span><br>
                  <span>Backup: ${escapeHtml(service.backup_path)}</span>
                </div>
                <span class="${
                  service.status === 'healthy' ? 'badge-good' : 'badge-warn'
                }">${escapeHtml(String(service.status).toUpperCase())}</span>
              </div>
            `
          )
          .join('')
      : '<p class="loading-copy">No service data available.</p>';
  }

  const incidentElement = document.getElementById('incident');
  if (incidentElement) {
    const incident = incidents[0];
    incidentElement.innerHTML = incident
      ? `
        <h3>${escapeHtml(incident.severity)} · ${escapeHtml(incident.title)}</h3>
        <p><strong>Impact:</strong> ${escapeHtml(incident.impact)}</p>
        <p><strong>State:</strong> ${escapeHtml(incident.state)}</p>
        <p><strong>Simulated MTTR:</strong> ${escapeHtml(incident.mttr_minutes)} minutes</p>
      `
      : '<p class="loading-copy">No simulated incidents recorded.</p>';
  }

  nodes.forEach((node) => {
    const nodeElement = document.getElementById(node.name);
    if (!nodeElement) return;
    nodeElement.classList.toggle('node-down', node.status !== 'up');
    nodeElement.title = `${node.name.toUpperCase()} · ${node.status}`;
  });

  const labHealthy =
    up === nodes.length &&
    established === peNodes.length &&
    healthyServices === services.length;

  setLabStatus(labHealthy, labHealthy ? 'Lab healthy' : 'Lab degraded');

  const generatedAt = document.getElementById('generatedAt');
  if (generatedAt && data.generated_at) {
    const date = new Date(data.generated_at);
    generatedAt.textContent = Number.isNaN(date.getTime())
      ? String(data.generated_at)
      : date.toLocaleString(undefined, {
          dateStyle: 'medium',
          timeStyle: 'short'
        });
  }
}

function renderError(error) {
  console.error(error);
  setLabStatus(false, 'State unavailable');

  const message = escapeHtml(error?.message || 'Unknown dashboard error');
  const services = document.getElementById('services');
  const incident = document.getElementById('incident');
  const errorBox = `<div class="error-box"><strong>Dashboard data unavailable</strong><span>${message}</span></div>`;

  if (services) services.innerHTML = errorBox;
  if (incident) incident.innerHTML = errorBox;
}

renderLoadingState();
loadState().then(renderState).catch(renderError);
