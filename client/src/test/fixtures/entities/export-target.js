const exportTarget = () => ({
  type: "exportTarget",
  attributes: {
    strategy: "sftp_key",
    name: "test export target",
    slug: "test-export-target",
    configuration: {
      sftpKey: {
        port: 2,
        host: "172.217.3.164",
        username: "rambo",
        compression: 0,
        privateKey: "testprivatekey"
      },
      sftpPassword: null,
      targetNameFormat: "%s-%t.%e",
      strategy: 1
    }
  }
});

export default exportTarget;
