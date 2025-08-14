import * as admin from "firebase-admin";

// 1) Point to your service account JSON or use GOOGLE_APPLICATION_CREDENTIALS
admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    // or: admin.credential.cert(require("./serviceAccountKey.json"))
});

async function setAdmin(uid: string, isAdmin = true) {
    const claims = isAdmin ? { role: "admin" } : { role: null };
    await admin.auth().setCustomUserClaims(uid, claims);
    console.log(`${isAdmin ? "Granted" : "Removed"} admin for`, uid);
}

async function main() {
    // TODO: Replace this with the Firebase UID of your user
    await setAdmin("PASTE_USER_UID_HERE", true);
    // Optionally revoke refresh tokens to force immediate claim refresh:
    await admin.auth().revokeRefreshTokens("PASTE_USER_UID_HERE");
}
main().catch(err => { console.error(err); process.exit(1); });