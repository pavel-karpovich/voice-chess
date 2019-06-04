workflow "Build and Deploy" {
  on = "push"
  resolves = ["Deploy on Firebase"]
}

action "Install Dependencies" {
  uses = "Tgjmjgj/npm@specify-workspace-directory"
  args = "install"
  env = {
    DIR = "./functions"
  }
}

action "Build project" {
  uses = "Tgjmjgj/npm@specify-workspace-directory"
  needs = ["Install Dependencies"]
  args = "run build"
  env = {
    DIR = "./functions"
  }
}

action "Deploy on Firebase" {
  uses = "w9jds/firebase-action@7d6b2b058813e1224cdd4db255b2f163ae4084d3"
  needs = ["Build project"]
  secrets = ["FIREBASE_TOKEN"]
  args = "deploy --only functions"
}
