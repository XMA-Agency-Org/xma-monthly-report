import { Document, Page, Text, View, Image, Svg, G, Path, Polygon, StyleSheet } from "@react-pdf/renderer";
import type { ReportData, PlatformId } from "../_types/report";
import { PLATFORMS, DELIVERABLE_CATEGORIES, NEXT_PLAN_PERIODS, computeCpa } from "../_lib/platforms";

const styles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica", fontSize: 10, color: "#1a1a1a" },
  header: { marginBottom: 24 },
  brandRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  brandLogo: { width: 32, height: 32, borderRadius: 4 },
  reportLabel: { fontSize: 10, color: "#666" },
  divider: { height: 2, backgroundColor: "#0d0d0d", marginBottom: 16 },
  thinDivider: { height: 1, backgroundColor: "#e0e0e0", marginVertical: 12 },
  periodText: { fontSize: 12, color: "#333", marginBottom: 4 },
  clientText: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  sectionTitle: { fontSize: 14, fontFamily: "Helvetica-Bold", marginBottom: 10, marginTop: 16 },
  summaryGrid: { flexDirection: "row", gap: 12, marginBottom: 16 },
  summaryCard: { flex: 1, padding: 10, backgroundColor: "#f5f5f5", borderRadius: 4 },
  summaryLabel: { fontSize: 8, color: "#666", marginBottom: 2, textTransform: "uppercase" as const },
  summaryValue: { fontSize: 16, fontFamily: "Helvetica-Bold" },
  tableHeader: { flexDirection: "row", backgroundColor: "#f0f0f0", padding: 6, borderRadius: 2, marginBottom: 2 },
  tableRow: { flexDirection: "row", padding: 6, borderBottomWidth: 1, borderBottomColor: "#eee" },
  cellPlatform: { flex: 2 },
  cellMetric: { flex: 1.5, textAlign: "right" as const },
  headerText: { fontSize: 8, fontFamily: "Helvetica-Bold", color: "#666", textTransform: "uppercase" as const },
  cellText: { fontSize: 9 },
  platformDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  platformRow: { flexDirection: "row", alignItems: "center" },
  insightsBox: { backgroundColor: "#f9f9f9", padding: 12, borderRadius: 4, marginBottom: 12 },
  insightsLabel: { fontSize: 9, fontFamily: "Helvetica-Bold", color: "#444", marginBottom: 4 },
  insightsText: { fontSize: 9, color: "#333", lineHeight: 1.5 },
  deliverableRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 6, paddingLeft: 8 },
  deliverableDot: { width: 5, height: 5, borderRadius: 2.5, marginRight: 6, marginTop: 3 },
  deliverableContent: { flex: 1 },
  deliverableDesc: { fontSize: 8, color: "#555", lineHeight: 1.4, marginBottom: 2 },
  statusBadge: { fontSize: 7, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 3, alignSelf: "flex-start" as const },
  footer: { position: "absolute", bottom: 30, left: 40, right: 40, flexDirection: "row", justifyContent: "space-between" },
  footerText: { fontSize: 8, color: "#999" },
});

function formatUsd(value: number): string {
  return `$${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

interface ReportPdfDocumentProps {
  data: ReportData;
}

export default function ReportPdfDocument({ data }: ReportPdfDocumentProps) {
  const enabledPlatforms = PLATFORMS.filter((p) => data.enabledPlatforms[p.id]);

  const totals = enabledPlatforms.reduce(
    (acc, p) => {
      const m = data.platformMetrics[p.id];
      acc.spend += m.adSpend;
      acc.conversions += m.conversions;
      acc.revenue += m.revenue;
      return acc;
    },
    { spend: 0, conversions: 0, revenue: 0 }
  );

  const overallCpa = computeCpa(totals.spend, totals.conversions);
  const overallRoas = totals.spend > 0 ? totals.revenue / totals.spend : 0;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.brandRow}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Image src="/icon.png" style={styles.brandLogo} />
              <Svg viewBox="0 0 126.4 38.4" style={{ width: 80, height: 24 }}>
                <G>
                  <Polygon fill="#010101" points="34.67,4.48 26.32,4.48 2.7,33.92 11.05,33.92 18.69,24.4 26.32,33.92 34.67,33.92 22.86,19.2" />
                  <Path fill="#010101" d="M73.96,4.71c-0.18,0.1-0.35,0.2-0.49,0.35L60.25,14.6L47,5.08v0c-0.34-0.37-0.82-0.61-1.36-0.61h-4.8v29.44h6.66V13.55l12.65,9.09c0.06,0.04,0.14,0.04,0.19,0l12.61-9.09v20.38h6.66V4.48h-4.8C74.5,4.48,74.22,4.58,73.96,4.71" />
                  <Path fill="#010101" d="M5.91,8.5l7.11,9.16l4.3-5.18l-1.84-2.35l-3.54-4.55c-0.07-0.08-0.15-0.15-0.23-0.23l-0.69-0.88H9.63H5.77H2.7L5.91,8.5L5.91,8.5z" />
                  <Path fill="#010101" d="M122.63,31.93c-0.03-0.08-0.08-0.15-0.12-0.22l-4.1-7.57l-0.01,0.01l-5.8-10.7l-0.01-0.02l-4.26-7.85c-0.01-0.01-0.01-0.01-0.02-0.02l-0.59-1.09h-1.67h-0.03h-3.83h-0.03h-1.76l-1.86,3.59L85.83,31.52c-0.11,0.14-0.18,0.29-0.24,0.44l-1.06,1.96h2.45h3.86h1.71l3.46-6.39l8.1-14.95l10.97,20.23c0,0,0,0,0,0l0.6,1.1h1.71h3.86h2.46L122.63,31.93z" />
                </G>
              </Svg>
            </View>
            <Text style={styles.reportLabel}>Monthly Performance Report</Text>
          </View>
          <View style={styles.divider} />
          <Text style={styles.clientText}>{data.clientName || "Client"}</Text>
          <Text style={styles.periodText}>
            {data.reportDate ? new Date(data.reportDate + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : ""}{data.preparedBy ? ` • Prepared by ${data.preparedBy}` : ""}
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Executive Summary</Text>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Ad Spend</Text>
            <Text style={styles.summaryValue}>{formatUsd(totals.spend)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Conversions</Text>
            <Text style={styles.summaryValue}>{totals.conversions.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Overall CPA</Text>
            <Text style={styles.summaryValue}>{formatUsd(overallCpa)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Overall ROAS</Text>
            <Text style={styles.summaryValue}>{overallRoas.toFixed(2)}x</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Platform Breakdown</Text>
        <View style={styles.tableHeader}>
          <View style={styles.cellPlatform}><Text style={styles.headerText}>Platform</Text></View>
          <View style={styles.cellMetric}><Text style={styles.headerText}>Ad Spend</Text></View>
          <View style={styles.cellMetric}><Text style={styles.headerText}>Conversions</Text></View>
          <View style={styles.cellMetric}><Text style={styles.headerText}>CPA</Text></View>
          <View style={styles.cellMetric}><Text style={styles.headerText}>ROAS</Text></View>
          <View style={styles.cellMetric}><Text style={styles.headerText}>Revenue</Text></View>
        </View>
        {enabledPlatforms.map((p) => {
          const m = data.platformMetrics[p.id];
          const cpa = computeCpa(m.adSpend, m.conversions);
          return (
            <View style={styles.tableRow} key={p.id}>
              <View style={{ ...styles.cellPlatform, ...styles.platformRow }}>
                <View style={{ ...styles.platformDot, backgroundColor: p.pdfColor }} />
                <Text style={styles.cellText}>{p.name}</Text>
              </View>
              <View style={styles.cellMetric}><Text style={styles.cellText}>{formatUsd(m.adSpend)}</Text></View>
              <View style={styles.cellMetric}><Text style={styles.cellText}>{m.conversions.toLocaleString()}</Text></View>
              <View style={styles.cellMetric}><Text style={styles.cellText}>{formatUsd(cpa)}</Text></View>
              <View style={styles.cellMetric}><Text style={styles.cellText}>{m.roas.toFixed(2)}x</Text></View>
              <View style={styles.cellMetric}><Text style={styles.cellText}>{formatUsd(m.revenue)}</Text></View>
            </View>
          );
        })}

        {(DELIVERABLE_CATEGORIES.some((c) => data.deliverables[c.id].length > 0) || (data.customDeliverables && data.customDeliverables.length > 0)) && (
          <>
            <Text style={styles.sectionTitle}>Deliverables</Text>
            {DELIVERABLE_CATEGORIES.filter((c) => data.deliverables[c.id].length > 0).map((category) => (
              <View key={category.id}>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6, marginTop: 8 }}>
                  <View style={{ ...styles.deliverableDot, backgroundColor: category.pdfColor }} />
                  <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>{category.label}</Text>
                </View>
                {data.deliverables[category.id].map((item, i) => {
                  const statusColors: Record<string, { bg: string; text: string }> = {
                    delivered: { bg: "#DEF7EC", text: "#03543F" },
                    "in-progress": { bg: "#FEF3C7", text: "#92400E" },
                    pending: { bg: "#F3F4F6", text: "#4B5563" },
                  };
                  const badge = statusColors[item.status] ?? statusColors.pending;
                  const statusLabel = item.status === "in-progress" ? "In Progress" : item.status === "delivered" ? "Delivered" : "Pending";

                  return (
                    <View style={styles.deliverableRow} key={i}>
                      <View style={styles.deliverableContent}>
                        <Text style={styles.deliverableDesc}>{item.description || `${category.label} #${i + 1}`}</Text>
                        <Text style={{ ...styles.statusBadge, backgroundColor: badge.bg, color: badge.text }}>
                          {statusLabel}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ))}
            {data.customDeliverables && data.customDeliverables.length > 0 && (
              <View>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6, marginTop: 8 }}>
                  <View style={{ ...styles.deliverableDot, backgroundColor: "#3B82F6" }} />
                  <Text style={{ fontSize: 11, fontFamily: "Helvetica-Bold" }}>Custom</Text>
                </View>
                {data.customDeliverables.map((item, i) => {
                  const statusColors: Record<string, { bg: string; text: string }> = {
                    delivered: { bg: "#DEF7EC", text: "#03543F" },
                    "in-progress": { bg: "#FEF3C7", text: "#92400E" },
                    pending: { bg: "#F3F4F6", text: "#4B5563" },
                  };
                  const badge = statusColors[item.status] ?? statusColors.pending;
                  const statusLabel = item.status === "in-progress" ? "In Progress" : item.status === "delivered" ? "Delivered" : "Pending";

                  return (
                    <View style={styles.deliverableRow} key={i}>
                      <View style={styles.deliverableContent}>
                        <Text style={styles.deliverableDesc}>{item.description || `Custom #${i + 1}`}</Text>
                        <Text style={{ ...styles.statusBadge, backgroundColor: badge.bg, color: badge.text }}>
                          {statusLabel}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </>
        )}

        {data.nextPlanActions && (
          <>
            <Text style={styles.sectionTitle}>Next Plan of Action</Text>
            <View style={styles.insightsBox}>
              <Text style={styles.insightsLabel}>
                Period: {NEXT_PLAN_PERIODS.find((p) => p.value === data.nextPlanPeriod)?.label ?? data.nextPlanPeriod}
              </Text>
              <Text style={styles.insightsText}>{data.nextPlanActions}</Text>
            </View>
          </>
        )}

        <View style={styles.footer}>
          <Text style={styles.footerText}>Generated on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</Text>
          <Text style={styles.footerText}>XMA Monthly Report</Text>
        </View>
      </Page>
    </Document>
  );
}
