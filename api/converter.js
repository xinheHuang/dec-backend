/**
 * Created by Xinhe on 2017-11-10.
 */

class Converter {
    static UserConverter(user) {
        if (!user) return undefined
        const { user_id, broker, email, name, position, username, mobile } = user
        return {
            userId: user_id,
            username,
            broker,
            email,
            name,
            position,
            mobile
        }
    }

    static GraphConverter(graph) {
        if (!graph) return undefined
        return {
            graphId: graph.graph_id,
            entity: graph.entity,
            time: graph.time,
            type: graph.type,
            userId: graph.user_id,
            name: graph.name,
            nodes: graph.GRAPH_NODEs ? graph.GRAPH_NODEs.map(({ node_id, title, GRAPH_NODE_RELATION }) => ({
                nodeId: node_id,
                title,
                parentNodeId: GRAPH_NODE_RELATION.parent_node_id,
                direction: GRAPH_NODE_RELATION.direction,
                graphNodeId: GRAPH_NODE_RELATION.id
            })) : undefined
        }
    }

    static NodeCommentConverter(nodeComment) {
        if (!nodeComment) return undefined
        const { USER, commend_id, content, node_id, time } = nodeComment
        return {
            commentId: comment_id,
            nodeId: node_id,
            time,
            content,
            user: Converter.UserConverter(USER)
        }
    }

    static ArticleConverter(article) {
        if (!article) return undefined
        const { INDUSTRY, STOCK, article_id, author, broker, num_like, num_read, time, title , content} = article
        return {
            articleId: article_id,
            author,
            broker,
            likeNumber: num_like,
            readNumber: num_read,
            time,
            title,
            content,
            stock: Converter.StockConverter(STOCK),
            industry: Converter.IndustryConverter(INDUSTRY)
        }
    }

    static StockConverter(stock) {
        if (!stock) return undefined
        const { code, stock_id, start_time, name, INDUSTRY } = stock
        return {
            stockId: stock_id,
            code,
            name,
            startTime: start_time,
            industry: Converter.IndustryConverter(INDUSTRY)
        }

    }

    static IndustryConverter(industry) {
        if (!industry) return undefined;
        //todo
    }
}

module.exports = Converter