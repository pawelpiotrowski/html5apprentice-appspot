# README #

app.yaml

    application: html5apprenticecom
    version: 1
    runtime: python27
    api_version: 1
    threadsafe: true
    
    handlers:
    # re-direct to index.html if no path is given
    - url: /
    static_files: index.html
    upload: index.html
    
    # access the static resources in the root directory
    
    - url: /(.*)
    static_files: \1
    upload: (.*)

