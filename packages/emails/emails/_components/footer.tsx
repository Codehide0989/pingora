/** @jsxImportSource react */

import { Link, Section, Text } from "@react-email/components";
import { styles } from "./styles";

export function Footer() {
  return (
    <Section style={{ textAlign: "center" }}>
      <Text>
        <Link style={styles.link} href="https://pingora.dev">
          Home Page
        </Link>{" "}
        ・{" "}
        <Link style={styles.link} href="mailto:ping@pingora.dev">
          Contact Support
        </Link>
      </Text>

      <Text>Pingora ・ 122 Rue Amelot ・ 75011 Paris, France</Text>
    </Section>
  );
}
