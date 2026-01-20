import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../src/context/ThemeContext';

export default function TermsOfServiceScreen() {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={[styles.backButtonText, { color: theme.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Terms of Service</Text>
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

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Acceptance of Terms</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          By downloading, installing, or using Herb, you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the app.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Age Requirement</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          You must be at least 21 years of age to use Herb. By using this app, you represent and warrant that you meet this age requirement. We reserve the right to terminate access for users who do not meet the age requirement.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Legal Compliance</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          Cannabis laws vary significantly by jurisdiction. You are solely responsible for ensuring that your use of this app and any cannabis consumption complies with all applicable local, state, federal, and international laws.
        </Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          Herb does not:
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Promote or encourage illegal activity
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Facilitate the purchase or sale of cannabis
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Provide legal or medical advice
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Guarantee compliance with any laws or regulations
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Medical Disclaimer</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          Herb is a tracking tool only and is not a medical device. This app does not provide medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider regarding any medical conditions or health concerns.
        </Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          The mood tracking, health benefits, and recovery features are for informational purposes only and should not replace professional medical care.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>User Responsibilities</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          You agree to:
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Use the app responsibly and in compliance with all applicable laws
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Provide accurate information when tracking your usage
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Not use the app if you are in a jurisdiction where cannabis is illegal
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Take responsibility for securing your device and data
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Not use the app for any unlawful purpose
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Intellectual Property</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          All content, features, and functionality of Herb, including but not limited to text, graphics, logos, icons, images, and software, are the exclusive property of Herb and are protected by copyright, trademark, and other intellectual property laws.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Limitation of Liability</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, HERB AND ITS DEVELOPERS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, OR OTHER INTANGIBLE LOSSES.
        </Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          We are not responsible for:
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Legal consequences of cannabis use in your jurisdiction
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Health effects of cannabis consumption
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Loss of data stored on your device
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Third-party service interruptions
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Disclaimer of Warranties</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          THE APP IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE APP WILL BE UNINTERRUPTED, ERROR-FREE, OR FREE OF VIRUSES OR OTHER HARMFUL COMPONENTS.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Subscription Terms</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          If you purchase Herb Pro (premium subscription):
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Subscriptions auto-renew unless canceled 24 hours before the renewal date
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Charges occur through your Apple ID account
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • Refunds are subject to Apple's refund policy
        </Text>
        <Text style={[styles.bulletPoint, { color: theme.textSecondary }]}>
          • You can manage subscriptions in your device settings
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Privacy</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          Your use of Herb is also governed by our Privacy Policy. All data is stored locally on your device. We do not collect, store, or share your personal information or usage data.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Termination</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          We reserve the right to terminate or suspend access to the app at any time, without prior notice or liability, for any reason, including breach of these Terms.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Changes to Terms</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          We reserve the right to modify these Terms at any time. We will notify users of material changes by updating the "Last Updated" date. Continued use of the app after changes constitutes acceptance of the modified Terms.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Governing Law</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which the app developer is located, without regard to conflict of law provisions.
        </Text>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Contact</Text>
        <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
          For questions about these Terms of Service, please contact us through the app's support channels.
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
          <Text style={styles.acceptButtonText}>I Accept</Text>
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
