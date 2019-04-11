# Iguassu Dashboard

Statement Driven Executor and Scheduler.

## Build & development

### System requirements

Install yo, grunt-cli, bower, generator-angular, generator-karma and compass globally:

```
npm install -g grunt-cli bower yo generator-karma generator-angular
gem install compass
```
### Build and run

Go to project folder and install project dependencies:

```
npm install
bower install
```

Go to /app directory, make a copy of env.example.js, rename to env.example and set vars' value.

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.
