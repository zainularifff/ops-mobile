const { AndroidConfig, withAndroidManifest, withDangerousMod } = require("expo/config-plugins");
const fs = require("fs");
const path = require("path");

const NETWORK_SECURITY_CONFIG = `<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
            <certificates src="system" />
            <certificates src="user" />
        </trust-anchors>
    </base-config>

    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">192.168.140.66</domain>
    </domain-config>
</network-security-config>
`;

function ensureApplication(manifest) {
  const application = AndroidConfig.Manifest.getMainApplicationOrThrow(manifest);
  application.$["android:usesCleartextTraffic"] = "true";
  application.$["android:networkSecurityConfig"] = "@xml/network_security_config";
  return manifest;
}

function withAndroidNetworkSecurity(config) {
  config = withAndroidManifest(config, (config) => {
    config.modResults = ensureApplication(config.modResults);
    return config;
  });

  config = withDangerousMod(config, ["android", async (config) => {
    const xmlDir = path.join(
      config.modRequest.platformProjectRoot,
      "app",
      "src",
      "main",
      "res",
      "xml"
    );
    const xmlPath = path.join(xmlDir, "network_security_config.xml");

    fs.mkdirSync(xmlDir, { recursive: true });
    fs.writeFileSync(xmlPath, NETWORK_SECURITY_CONFIG);

    return config;
  }]);

  return config;
}

module.exports = withAndroidNetworkSecurity;
