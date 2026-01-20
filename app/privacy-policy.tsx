import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';

export default function PrivacyPolicyScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: theme.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Privacy Policy</Text>
      </View>

      {/* Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.lastUpdated, { color: theme.textSecondary }]}>
          Last Updated: December 12, 2024
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Introduction</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          Herb ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we handle your information when you use our mobile application for tracking cannabis consumption.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Data Collection and Storage</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          Herb operates on a privacy-first principle. All your data is stored locally on your device only. We do not collect, transmit, or store any personal information on external servers.
        </Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          The following information is stored locally on your device:
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Session tracking data (consumption method, strain, amount, cost, mood)
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Mood and feelings entries
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Tolerance break information
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • User preferences and settings
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Badge achievements and progress
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>No Account Required</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          Herb does not require user registration or account creation. You can use the app anonymously without providing any personal identifying information.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Third-Party Services</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          We use RevenueCat for subscription management (if you purchase Herb Pro). RevenueCat's privacy policy governs how they handle subscription-related data. We do not share your usage data with RevenueCat or any other third party.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Analytics and Crash Reporting</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          We do not use analytics or crash reporting services that collect personal information. Any technical data collected is anonymized and used solely for improving app performance.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Data Security</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          Your data is protected by your device's security features. We recommend using device encryption and password protection to secure your information. Since data is stored locally, backing up your device will include your Herb data.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Age Restriction</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          Herb is intended for adults 21 years of age or older. We do not knowingly collect information from users under 21. If you are under 21, do not use this app.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Cannabis Legal Disclaimer</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          Cannabis laws vary by jurisdiction. This app does not promote illegal activity. Users are solely responsible for ensuring their cannabis use complies with local, state, and federal laws. We do not store or share information about your cannabis consumption with law enforcement or government agencies.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Data Deletion</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          You can delete all your data at any time by uninstalling the app from your device. This will permanently remove all locally stored information. We cannot recover this data as it was never stored on our servers.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Changes to This Policy</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date. Your continued use of the app after changes constitutes acceptance of the updated policy.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact Us</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          If you have questions about this Privacy Policy, please contact us through the app's support channels.
        </Text>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Footer Button */}
      <View style={[styles.footer, { backgroundColor: theme.background, borderTopColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.acceptButton, { backgroundColor: theme.primary }]}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Text style={styles.acceptButtonText}>I Understand</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  backButton: {
    marginBottom: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 100,
  },
  lastUpdated: {
    fontSize: 13,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 12,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 16,
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 8,
    paddingLeft: 8,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
  },
  acceptButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});
