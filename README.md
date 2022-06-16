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

### Example: Back Home

This config will navigate back to the first tab on your dashboard after 5 seconds. 
```yaml
type: custom:timed-action-card
name: Go back to primary tab
timeout: 5
action: navigate
navigation_path: ./
```
### Options

| Name            | Type   | Default        | Use With Action | Description
|-----------------|--------|----------------|-----------------|------------
| type            | string | **Required**   | Any             | `custom:timed-action-card`
| name            | string | optional       | Any             | A name for the card. Is only shown in edit mode.
| timeout         | number | 10             | Any             | The timeout in seconds.
| action          | string | 'navigate'     | Any             | The type of action to run when the timeout has passed.
| navigation_path | string | 'default_view' | 'navigate'      | The path to navigate to.
| service         | string | **Required**   | 'call-service'  | The service to call.
| service_data    | string | **object**     | 'call-service'  | The data used by the service call.
| target          | string | **object**     | 'call-service'  | The target, or a list of targets, for which to call the service.

### Supported Actions
- navigate
- call-service

### Note on Service-Call actions

The service call option is only partialy implemented at the moment and therefore doesn't support all options. At the moment is only supports entity_id's as target. Some services might not work as intended.
