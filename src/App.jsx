import React, { useMemo, useState } from "react";
import { AlertTriangle, Bus, Clock3, Users, TrendingUp, Search } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const operationalSummary = {
  date: "Tuesday, March 24, 2026",
  serviceDay: "Weekday",
  currentTime: "5:32 AM",
  systemCoverage: 91.8,
  scheduledOperators: 612,
  listEmployees: 562,
  openWork: 50,
  atRiskGarages: 2,
};

const garageStatus = [
  {
    garage: "Cabot",
    scheduled: 162,
    list: 153,
    openWork: 9,
    coverage: 94.4,
    missedPullouts: 1,
    standbyAvailable: 4,
    status: "Stable",
  },
  {
    garage: "Albany",
    scheduled: 141,
    list: 125,
    openWork: 16,
    coverage: 88.7,
    missedPullouts: 3,
    standbyAvailable: 1,
    status: "Critical",
  },
  {
    garage: "Southampton",
    scheduled: 156,
    list: 145,
    openWork: 11,
    coverage: 92.9,
    missedPullouts: 1,
    standbyAvailable: 2,
    status: "Watch",
  },
  {
    garage: "Arborway",
    scheduled: 153,
    list: 139,
    openWork: 14,
    coverage: 90.8,
    missedPullouts: 2,
    standbyAvailable: 1,
    status: "Watch",
  },
];

const trendData = [
  { time: "4:00", coverage: 95.2 },
  { time: "4:30", coverage: 94.3 },
  { time: "5:00", coverage: 93.4 },
  { time: "5:30", coverage: 91.8 },
  { time: "6:00", coverage: 92.1 },
  { time: "6:30", coverage: 92.7 },
];

const actionFeed = [
  {
    priority: "High",
    garage: "Albany",
    issue: "16 open pieces before AM pull-out",
    action: "Call extra board and reassign standby operators",
  },
  {
    priority: "High",
    garage: "Arborway",
    issue: "2 missed pull-outs flagged",
    action: "Coordinate with dispatch and review uncovered work",
  },
  {
    priority: "Medium",
    garage: "Southampton",
    issue: "Coverage below 93%",
    action: "Monitor late call-outs and prepare fill plan",
  },
];

const rosterRows = [
  { id: 1, garage: "Cabot", employee: "Operator 001", position: "123001", piece: "1001", shift: "Early AM", report: "2:37 AM", release: "10:25 AM", origin: "cabot", destination: "cabot", scheduled: "Yes", list: "Yes", status: "Covered" },
  { id: 2, garage: "Cabot", employee: "Operator 020", position: "123020", piece: "1043", shift: "AM", report: "5:34 AM", release: "2:34 PM", origin: "cabot", destination: "rugg", scheduled: "Yes", list: "No", status: "Open" },
  { id: 3, garage: "Cabot", employee: "Operator 026", position: "123026", piece: "1060", shift: "Midday", report: "9:37 AM", release: "6:12 PM", origin: "rugg", destination: "rugg", scheduled: "Yes", list: "Yes", status: "Covered" },
  { id: 4, garage: "Albany", employee: "Operator 043", position: "123043", piece: "1501", shift: "Early AM", report: "4:33 AM", release: "11:35 AM", origin: "albny", destination: "albny", scheduled: "Yes", list: "Yes", status: "Covered" },
  { id: 5, garage: "Albany", employee: "Operator 061", position: "123061", piece: "1536", shift: "AM", report: "5:58 AM", release: "3:31 PM", origin: "albny", destination: "dudly", scheduled: "Yes", list: "No", status: "Open" },
  { id: 6, garage: "Albany", employee: "Operator 066", position: "123066", piece: "1552", shift: "Midday", report: "10:33 AM", release: "8:10 PM", origin: "kenbs", destination: "albny", scheduled: "Yes", list: "Yes", status: "Covered" },
  { id: 7, garage: "Southampton", employee: "Operator 101", position: "124101", piece: "3051", shift: "Early AM", report: "3:54 AM", release: "12:02 PM", origin: "soham", destination: "soham", scheduled: "Yes", list: "Yes", status: "Covered" },
  { id: 8, garage: "Southampton", employee: "Operator 119", position: "124119", piece: "3094", shift: "AM", report: "6:11 AM", release: "3:28 PM", origin: "soham", destination: "copley", scheduled: "Yes", list: "No", status: "Open" },
  { id: 9, garage: "Arborway", employee: "Operator 207", position: "125207", piece: "4082", shift: "AM", report: "5:07 AM", release: "1:46 PM", origin: "brway", destination: "brway", scheduled: "Yes", list: "Yes", status: "Covered" },
  { id: 10, garage: "Arborway", employee: "Operator 214", position: "125214", piece: "4106", shift: "PM", report: "1:42 PM", release: "10:19 PM", origin: "brway", destination: "brway", scheduled: "Yes", list: "No", status: "Open" },
  { id: 11, garage: "Cabot", employee: "Operator 093", position: "123093", piece: "OL", shift: "List", report: "Open", release: "Open", origin: "list", destination: "list", scheduled: "No", list: "Yes", status: "Extra board" },
  { id: 12, garage: "Cabot", employee: "Operator 094", position: "123094", piece: "OL", shift: "List", report: "Open", release: "Open", origin: "list", destination: "list", scheduled: "No", list: "Yes", status: "Extra board" },
];

function statusPill(status) {
  if (status === "Stable" || status === "Covered") return "#d1fae5 #065f46";
  if (status === "Watch") return "#fef3c7 #92400e";
  if (status === "Critical" || status === "Open") return "#fee2e2 #991b1b";
  return "#e5e7eb #374151";
}

function MetricCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div style={styles.metricCard}>
      <div>
        <div style={styles.metricLabel}>{title}</div>
        <div style={styles.metricValue}>{value}</div>
        <div style={styles.metricSub}>{subtitle}</div>
      </div>
      <div style={styles.metricIconWrap}>
        <Icon size={18} />
      </div>
    </div>
  );
}

function Pill({ label }) {
  const [bg, color] = statusPill(label).split(" ");
  return <span style={{ ...styles.pill, background: bg, color }}>{label}</span>;
}

export default function App() {
  const [selectedGarage, setSelectedGarage] = useState("All");
  const [search, setSearch] = useState("");

  const filteredRoster = useMemo(() => {
    return rosterRows.filter((row) => {
      const matchesGarage = selectedGarage === "All" || row.garage === selectedGarage;
      const matchesSearch =
        row.employee.toLowerCase().includes(search.toLowerCase()) ||
        row.position.toLowerCase().includes(search.toLowerCase()) ||
        row.piece.toLowerCase().includes(search.toLowerCase());
      return matchesGarage && matchesSearch;
    });
  }, [selectedGarage, search]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <header style={styles.header}>
          <div>
            <div style={styles.eyebrow}>Bus Operations Staffing Tool</div>
            <h1 style={styles.title}>Garage Leadership Coverage Dashboard</h1>
            <p style={styles.subtitle}>
              Real-time operational view of scheduled work, list employees, uncovered pieces, and pull-out risk by garage.
            </p>
          </div>
          <div style={styles.headerMeta}>
            <div><strong>{operationalSummary.date}</strong></div>
            <div>{operationalSummary.currentTime}</div>
            <div>{operationalSummary.serviceDay} service</div>
          </div>
        </header>

        <section style={styles.metricGrid}>
          <MetricCard title="System coverage" value={`${operationalSummary.systemCoverage}%`} subtitle="Live staffing ratio" icon={TrendingUp} />
          <MetricCard title="Scheduled operators" value={operationalSummary.scheduledOperators} subtitle="Expected to cover work" icon={Users} />
          <MetricCard title="List employees" value={operationalSummary.listEmployees} subtitle="Available / assigned today" icon={Bus} />
          <MetricCard title="Open work" value={operationalSummary.openWork} subtitle="Still uncovered" icon={AlertTriangle} />
        </section>

        <div style={styles.topGrid}>
          <section style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Garage status</h2>
              <div style={styles.smallNote}>Sorted by highest operational risk</div>
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th>Garage</th>
                    <th>Scheduled</th>
                    <th>List</th>
                    <th>Open</th>
                    <th>Coverage</th>
                    <th>Missed pull-outs</th>
                    <th>Standby</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {garageStatus.map((row) => (
                    <tr key={row.garage} onClick={() => setSelectedGarage(row.garage)} style={{ cursor: "pointer" }}>
                      <td><strong>{row.garage}</strong></td>
                      <td>{row.scheduled}</td>
                      <td>{row.list}</td>
                      <td>{row.openWork}</td>
                      <td>{row.coverage}%</td>
                      <td>{row.missedPullouts}</td>
                      <td>{row.standbyAvailable}</td>
                      <td><Pill label={row.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Coverage trend</h2>
              <div style={styles.smallNote}>Early morning staffing movement</div>
            </div>
            <div style={{ width: "100%", height: 270 }}>
              <ResponsiveContainer>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="time" />
                  <YAxis domain={[88, 96]} />
                  <Tooltip />
                  <Line type="monotone" dataKey="coverage" stroke="#111827" strokeWidth={2.5} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div style={styles.middleGrid}>
          <section style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Attention required</h2>
              <div style={styles.smallNote}>{operationalSummary.atRiskGarages} garages below target</div>
            </div>
            <div style={styles.feedList}>
              {actionFeed.map((item, index) => (
                <div key={index} style={styles.feedItem}>
                  <div style={styles.feedTop}>
                    <div style={styles.feedGarage}>{item.garage}</div>
                    <Pill label={item.priority} />
                  </div>
                  <div style={styles.feedIssue}>{item.issue}</div>
                  <div style={styles.feedAction}><strong>Recommended action:</strong> {item.action}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={styles.panel}>
            <div style={styles.panelHeader}>
              <h2 style={styles.panelTitle}>Pull-out watch</h2>
              <div style={styles.smallNote}>Immediate service risk indicators</div>
            </div>
            <div style={styles.watchGrid}>
              <div style={styles.watchCard}>
                <div style={styles.watchLabel}>AM peak uncovered</div>
                <div style={styles.watchValue}>29</div>
                <div style={styles.watchSub}>across all garages</div>
              </div>
              <div style={styles.watchCard}>
                <div style={styles.watchLabel}>Extra board available</div>
                <div style={styles.watchValue}>8</div>
                <div style={styles.watchSub}>can be reassigned</div>
              </div>
              <div style={styles.watchCard}>
                <div style={styles.watchLabel}>Missed pull-outs</div>
                <div style={styles.watchValue}>7</div>
                <div style={styles.watchSub}>reported so far</div>
              </div>
              <div style={styles.watchCard}>
                <div style={styles.watchLabel}>Late call-outs</div>
                <div style={styles.watchValue}>12</div>
                <div style={styles.watchSub}>since 4:00 AM</div>
              </div>
            </div>
          </section>
        </div>

        <section style={styles.panel}>
          <div style={styles.panelHeader}>
            <h2 style={styles.panelTitle}>Roster detail</h2>
            <div style={styles.controls}>
              <div style={styles.searchWrap}>
                <Search size={15} />
                <input
                  style={styles.searchInput}
                  placeholder="Search employee, position, or piece"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select value={selectedGarage} onChange={(e) => setSelectedGarage(e.target.value)} style={styles.select}>
                <option value="All">All garages</option>
                {garageStatus.map((g) => (
                  <option key={g.garage} value={g.garage}>{g.garage}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Garage</th>
                  <th>Employee</th>
                  <th>Position</th>
                  <th>Piece</th>
                  <th>Shift</th>
                  <th>Report</th>
                  <th>Release</th>
                  <th>Origin</th>
                  <th>Destination</th>
                  <th>Scheduled</th>
                  <th>List</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredRoster.map((row) => (
                  <tr key={row.id}>
                    <td>{row.garage}</td>
                    <td><strong>{row.employee}</strong></td>
                    <td>{row.position}</td>
                    <td>{row.piece}</td>
                    <td>{row.shift}</td>
                    <td>{row.report}</td>
                    <td>{row.release}</td>
                    <td>{row.origin}</td>
                    <td>{row.destination}</td>
                    <td>{row.scheduled}</td>
                    <td>{row.list}</td>
                    <td><Pill label={row.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#111827",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  container: {
    maxWidth: 1400,
    margin: "0 auto",
    padding: "28px 20px 40px",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    gap: 20,
    alignItems: "flex-start",
    marginBottom: 22,
    flexWrap: "wrap",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#6b7280",
    marginBottom: 8,
  },
  title: {
    fontSize: 34,
    lineHeight: 1.1,
    margin: 0,
  },
  subtitle: {
    fontSize: 15,
    color: "#4b5563",
    marginTop: 10,
    maxWidth: 760,
  },
  headerMeta: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 14,
    minWidth: 200,
    lineHeight: 1.7,
    fontSize: 14,
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 14,
    marginBottom: 18,
  },
  metricCard: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 16,
    padding: 18,
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  metricLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 30,
    fontWeight: 700,
    lineHeight: 1,
  },
  metricSub: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 8,
  },
  metricIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 12,
    background: "#f3f4f6",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#374151",
  },
  topGrid: {
    display: "grid",
    gridTemplateColumns: "1.4fr 1fr",
    gap: 18,
    marginBottom: 18,
  },
  middleGrid: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 18,
    marginBottom: 18,
  },
  panel: {
    background: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: 18,
    padding: 18,
  },
  panelHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 14,
    marginBottom: 14,
    flexWrap: "wrap",
  },
  panelTitle: {
    margin: 0,
    fontSize: 20,
  },
  smallNote: {
    fontSize: 13,
    color: "#6b7280",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    fontSize: 14,
  },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    borderRadius: 999,
    padding: "5px 10px",
    fontSize: 12,
    fontWeight: 700,
  },
  feedList: {
    display: "grid",
    gap: 12,
  },
  feedItem: {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 14,
    background: "#fafafa",
  },
  feedTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
  },
  feedGarage: {
    fontWeight: 700,
  },
  feedIssue: {
    fontSize: 15,
    marginBottom: 8,
  },
  feedAction: {
    fontSize: 13,
    color: "#4b5563",
  },
  watchGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
  },
  watchCard: {
    border: "1px solid #e5e7eb",
    borderRadius: 14,
    padding: 14,
    background: "#fafafa",
  },
  watchLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginBottom: 8,
  },
  watchValue: {
    fontSize: 28,
    fontWeight: 700,
    lineHeight: 1,
  },
  watchSub: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 8,
  },
  controls: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
    alignItems: "center",
  },
  searchWrap: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    border: "1px solid #d1d5db",
    background: "#fff",
    borderRadius: 12,
    padding: "0 10px",
    height: 40,
  },
  searchInput: {
    border: "none",
    outline: "none",
    fontSize: 14,
    minWidth: 220,
  },
  select: {
    height: 40,
    borderRadius: 12,
    border: "1px solid #d1d5db",
    background: "#fff",
    padding: "0 12px",
    fontSize: 14,
  },
};

const tableStyle = document.createElement("style");
tableStyle.innerHTML = `
  th, td {
    padding: 12px 10px;
    border-bottom: 1px solid #e5e7eb;
    text-align: left;
    white-space: nowrap;
  }
  th {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #6b7280;
    font-weight: 700;
  }
  tbody tr:hover {
    background: #f9fafb;
  }
  @media (max-width: 980px) {
    .two-col, .mid-col {
      grid-template-columns: 1fr !important;
    }
  }
`;
if (typeof document !== "undefined" && !document.getElementById("garage-dashboard-inline-style")) {
  tableStyle.id = "garage-dashboard-inline-style";
  document.head.appendChild(tableStyle);
}
