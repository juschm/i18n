**Status**: alpha, work in progress

# About

This is the implementation for the i18n support for AngularJS 1.4+ and Angular2.  It's meant to be generic enough so as not to be too tied to Angular though the initial versions will be focussed entirely on Angular.

# References
The primary reference document is [Angular and Internationalization: The New World][] published under published under [Angular Public][]/[Design Docs][]/[i18n][].

The document [v1.0][] focusses on work for first release.

# Quick Start

```zsh
# Checkout the source
git clone git@github.com:angular/i18n.git
cd i18n

# Install pre-requisites.
# This will ask you for sudo permissions.
./scripts/setup
```

## Build

```zsh
./scripts/build
```


## Run tests

```zsh
./scripts/run-tests
```


## Run an extraction

```zsh
# Writes to ./i18nData/messages.json
./bin/extract_messages
```


<!-- Named Links -->

[Angular and Internationalization: The New World]: https://drive.google.com/open?id=1mwyOFsAD-bPoXTk3Hthq0CAcGXCUw-BtTJMR4nGTY-0
[Angular Public]: https://drive.google.com/folderview?id=0BxgtL8yFJbacQmpCc1NMV3d5dnM
[Design Docs]: https://drive.google.com/folderview?id=0BxgtL8yFJbacUnUxc3l5aTZrbVk
[i18n]: https://drive.google.com/folderview?id=0B8aAcQMyRhIWQUxyOXBDeHRPcTg
[v1.0]: https://drive.google.com/open?id=1-pLAhklbR7CMLkY4pYgwjoDCLyNlNGVnO_lDZiuN9KA
