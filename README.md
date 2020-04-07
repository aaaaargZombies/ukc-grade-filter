# UKC Grade Filter

A simple Firefox extension that allows you to view grade range for a crag while not disrupting the locations.

![Preview](previews/ukcgradefilter.gif)

## Running locally

If you would like to try running locally or modifying try the following steps to get up and running.

```
git clone [address]
npm install
```

Install [`web-ext`](https://extensionworkshop.com/documentation/develop/getting-started-with-web-ext/) if you don't have it already

```
npm install --global web-ext
```

Run webpack and web-ext

```
npx webpack -w
```

```
web-ext run --verbose --start-url https://www.ukclimbing.com/logbook/crag.php\?id\=104
```
