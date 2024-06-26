// Imports
import { width } from './size/width'
// Constants
const functions = [width]

const confirmMsgs = ["Done!", "You got it!", "Aye!", "Is that all?", "My job here is done.", "Gotcha!", "It wasn't hard.", "Got it! What's next?"]
const renameMsgs = ["Cleaned", "Affected", "Made it with", "Fixed"]
const idleMsgs = ["All great, already", "Nothing to do, everything's good", "Any layers to affect? Can't see it", "Nothing to do, your layers are great"]

// Variables
let notification: NotificationHandler
let selection: ReadonlyArray<SceneNode>
let working: boolean
let count: number = 0

figma.on("currentpagechange", cancel)

// Main + Elements Check
figma.on('run', async ({ parameters }: RunEvent) => {
  run(parameters.property, parameters.value)
})

figma.parameters.on(
  'input',
  async ({ key, query, result }: ParameterInputEvent) => {
    switch (key) {
      case 'property': {
        result.setSuggestions(functions.map((el, index) => ({
          name: camelCaseToWords(el.name),
          data: index
        })).filter(s => s.name.toLowerCase().includes(query.toLowerCase())))
        break
      }
      default:
        return
    }
  }
)

async function run(property, value) {
  selection = figma.currentPage.selection
  // Anything selected?
  if (selection.length)
    for (const node of selection)
      await functions[property](node, value)
  else {
    notify('No layers selected')
  }
  finish()
}

// Action for selected nodes
async function mainFunction(node: SceneNode | PageNode) {
  count++
}

function camelCaseToWords(s: string): string {
  const result = s.replace(/([A-Z])/g, ' $1')
  return result
}

// Ending the work
function finish() {
  working = false
  figma.root.setRelaunchData({ relaunch: '' })
  if (count > 0) {
    notify(confirmMsgs[Math.floor(Math.random() * confirmMsgs.length)] +
      " " + renameMsgs[Math.floor(Math.random() * renameMsgs.length)] +
      " " + ((count === 1) ? "only one layer" : (count + " layers")))

  }
  else notify(idleMsgs[Math.floor(Math.random() * idleMsgs.length)])
  setTimeout(() => { console.log("Timeouted"), figma.closePlugin() }, 3000)
}

// Show new notification
function notify(text: string) {
  if (notification != null)
    notification.cancel()
  notification = figma.notify(text)
}

// Showing interruption notification
function cancel() {
  if (notification != null)
    notification.cancel()
  if (working) {
    notify("Plugin work have been interrupted")
  }
}