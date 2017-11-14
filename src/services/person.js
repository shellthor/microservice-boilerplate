import Post from '../models/person'

async function load(id) {
  const result = await Post.get(id)
  return result
}

async function create(data) {
  const post = new Post({
    title: data.title,
    content: data.content,
  })
  await post.save()
}

async function update(id, data) {
  const post = await load(id)
  post.title = data.title
  post.content = data.content
  await post.save()
}

async function list(params = {}) {
  const {limit = 50, skip = 0} = params
  const result = await Post.list({limit, skip})
  return result
}

async function remove(params) {
  const post = await load(params)
  await post.remove()
}

export default {load, create, update, list, remove}
