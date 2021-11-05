# Configuring local .test domains

_This step is totally optional and you can use chalet without it._

To use local `.test` domain, you need to configure your browser or network to use chalet's proxy auto-config file which is available at `http://localhost:2000/proxy.pac` [[view file content](../src/daemon/views/proxy-pac.pug)].

**Important** chalet MUST be running before configuring your network or browser so that `http://localhost:2000/proxy.pac` is available. If chalet is started after and you can't access `.test` domains, simply disable/enable network or restart browser.

## Configuring another .tld

You can edit `~/.chalet/conf.json` to use another Top-level Domain than `.test`.

```json
{
  "tld": "test"
}
```

**Important** Don't forget to restart chalet and reload network or browser configuration.

## System configuration (recommended)

##### macOS

`Network Preferences > Advanced > Proxies > Automatic Proxy Configuration`

##### Windows

`Settings > Network and Internet > Proxy > Use setup script`

##### Linux

On Ubuntu

`System Settings > Network > Network Proxy > Automatic`

For other distributions, check your network manager and look for proxy configuration. Use browser configuration as an alternative.

## Browser configuration

Browsers can be configured to use a specific proxy. Use this method as an alternative to system-wide configuration.

##### Chrome

Exit Chrome and start it using the following option:

```sh
# Linux
$ google-chrome --proxy-pac-url=http://localhost:2000/proxy.pac

# macOS
$ open -a "Google Chrome" --args --proxy-pac-url=http://localhost:2000/proxy.pac
```

##### Firefox

`Preferences > Advanced > Network > Connection > Settings > Automatic proxy URL configuration`

##### Internet Explorer

Uses system network configuration.
