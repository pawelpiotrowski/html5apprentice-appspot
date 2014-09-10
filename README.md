# README #

### My private repo for html5apprentice.com ###

## TO DO ##

* Check iscroll refresh event for each scroll instance against scope
* Delay state for animation out if in detail view

## DISTRIBUTION ##

Put app.yaml in dist folder

it should contain:
    
    application: html5apprenticecom
    version: 1
    runtime: python27
    api_version: 1
    threadsafe: true
    
    handlers:
    - url: /
    static_files: index.html
    upload: index.html
    
    - url: /(.*)
    static_files: \1
    upload: (.*)
