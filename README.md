# This Package is un-working, please wait for a new update!
# EXScript

A simply overloaded "npm run"!

# Installation

```
npm i -g exscript
```

# Usage

[] = optional, <> = required

#### Editing Scripts
$Windows_HOMEDIR/.scripty/scripts.json is where we store scripts.

```
exscript config [-e]
// (-e opens in explorer)
```
#### Running Scripts
```
exscript -r <name|default:default>
// default: echo \"hello\"
```

#### Reloading Config

```
exscript reload
```

# ToDo

- [ ] Create Config V2 with script types
- [ ] Fix Config reload broken
- [ ] Cross OS Compatibility (currently written for windows)