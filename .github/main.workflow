workflow "New workflow" {
  on = "push"
  resolves = ["Deploy on Firebase"]
}

action "Install Dependencies" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "Build project" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  needs = ["Install Dependencies"]
  args = "run build"
  
}

action "Deploy on Firebase" {
  uses = "w9jds/firebase-action@7d6b2b058813e1224cdd4db255b2f163ae4084d3"
  needs = ["Build project"]
  secrets = ["FIREBASE_TOKEN"]
  args = "deploy --only functions"
}
