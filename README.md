# Timed Action Card

A hidden card, that will trigger the configured action after a given timeout has elapsed. The timer
will be reset on every interaction with the dashboard tab. I Use this card for wall mounted panels,
to go back to the main tab after accessing a details tab for a specific light.

## Installation

### HACS
Comming soon

### Manual
- Copy 'dist/timed-action-card.js' to 'www/resources/times-action-card/times-action-card.js'.
- Add 'www/resources/times-action-card/times-action-card.js' to your resource list.

## Configuration

At the moment the card doesn't have a visual configurator so you'll need to configure us using Yaml.

### Example 1: Back Home

This config will navigate back to the first tab on your dashboard after 5 seconds. 
```yaml
type: custom:timed-action-card
name: Go back to primary tab
timeout: 5
action: navigate
navigation_path: ./
```
### Options

| Name            | Type   | For action | Default        | Description
|-----------------|--------|------------|----------------|------------
| type            | string |            | **Required**   | `custom:timed-action-card`
| name            | string |            | optional       | A name for the card. Is only shown in edit mode.
| timeout         | number |            | 10             | The timeout in seconds.
| action          | string |            | 'navigate'     | The type of action to run when the timeout has passed.
|-----------------|--------|------------|----------------|------------
| navigation_path | string | 'navigate' | 'default_view' | The path to navigate to.
|-----------------|--------|------------|----------------|------------
| navigation_path | string | 'navigate' | 'default_view' | The path to navigate to.
