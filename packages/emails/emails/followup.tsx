/** @jsxImportSource react */

import { Body, Head, Html, Preview } from "@react-email/components";

const FollowUpEmail = () => {
  return (
    <Html>
      <Head>
        <title>How's it going with pingora?</title>
      </Head>
      <Preview>How's it going with pingora?</Preview>
      <Body>
        Hey
        <br />
        <br />
        How’s everything going with pingora so far? Let me know if you run
        into any issues, or have any feedback, good or bad!
        <br />
        <br />
        Thank you,
        <br />
        <br />
        Thibault Le Ouay Ducasse
        <br />
      </Body>
    </Html>
  );
};

export default FollowUpEmail;
