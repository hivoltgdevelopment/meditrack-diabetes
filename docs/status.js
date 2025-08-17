<div class="card" id="dev-status-card">
  <h2>Dev server status</h2>
  <p>Checks your Expo dev server every 5 seconds.</p>

  <div class="row" style="align-items:flex-end">
    <label>
      <div style="margin-bottom:6px">LAN Host (IPv4)</div>
      <input id="lanHost" placeholder="192.168.0.109"
             style="padding:10px;border-radius:10px;border:1px solid var(--border);background:#0f172a;color:var(--text)" />
    </label>
    <label>
      <div style="margin-bottom:6px">Port</div>
      <input id="lanPort" placeholder="19000" value="19000"
             style="padding:10px;border-radius:10px;border:1px solid var(--border);background:#0f172a;color:var(--text);width:100px" />
    </label>
    <button id="saveCfg" class="btn primary">Save</button>
    <span id="statusDot" style="display:inline-flex;align-items:center;gap:8px">
      <span id="dot" style="width:12px;height:12px;border-radius:50%;background:#6B7280;display:inline-block"></span>
      <span id="statusText" style="color:#9ca3af">Unknown</span>
    </span>
  </div>

  <small style="color:var(--muted);display:block;margin-top:8px">
    We try <code>http://&lt;host&gt;:&lt;port&gt;/status</code> and <code>http://&lt;host&gt;:8081/status</code>.
    Expo reports <em>packager-status: running</em> when online.
  </small>
</div>
