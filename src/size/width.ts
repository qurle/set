export const width = (node: SceneNode, newWidth) => {
    try {
        const newHeight = node.constraintProportions ? Math.round(node.height / node.width * newWidth) : node.height
        node.resize(newWidth, newHeight)
    } catch (e) {
        figma.notify(`Couldn't resize: ${e}`, { error: true })
    }
}