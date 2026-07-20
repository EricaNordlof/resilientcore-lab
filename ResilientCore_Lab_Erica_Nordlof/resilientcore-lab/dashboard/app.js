async function loadState(){
  const res = await fetch('../data/network-state.json');
  if(!res.ok) throw new Error('Could not load network state');
  return res.json();
}

function metric(label,value){
  return `<article class="metric"><strong>${value}</strong><span>${label}</span></article>`;
}

loadState().then(data=>{
  const nodes=data.nodes||[];
  const up=nodes.filter(n=>n.status==='up').length;
  const pe=nodes.filter(n=>n.role==='PE');
  const established=pe.filter(n=>n.bgp_vpnv4==='established').length;
  const avgCpu=Math.round(nodes.reduce((a,n)=>a+n.cpu,0)/nodes.length);
  document.getElementById('metrics').innerHTML=[
    metric('Nodes operational',`${up}/${nodes.length}`),
    metric('VPNv4 sessions',`${established}/${pe.length}`),
    metric('Healthy services',data.services.filter(s=>s.status==='healthy').length),
    metric('Average CPU',`${avgCpu}%`)
  ].join('');

  document.getElementById('services').innerHTML=data.services.map(s=>`<div class="row"><div><strong>${s.name}</strong><br><span>${s.primary_path}</span></div><span class="badge-good">${s.status.toUpperCase()}</span></div>`).join('');

  const i=data.incidents[0];
  document.getElementById('incident').innerHTML=`<h3>${i.severity} · ${i.title}</h3><p><strong>Impact:</strong> ${i.impact}</p><p><strong>State:</strong> ${i.state}</p><p><strong>Simulated MTTR:</strong> ${i.mttr_minutes} minutes</p>`;
}).catch(err=>{
  document.body.insertAdjacentHTML('beforeend',`<pre style="padding:20px;color:#ffb4b4">${err.message}</pre>`);
});
