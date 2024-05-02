/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  useState,
  FormEvent,
  ChangeEvent,
  InvalidEvent,
} from "react";
import { Avatar } from "./Avatar";
import { Comment } from "./Comment";
import styles from "./Post.module.css";
import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function Post({ author, content, publishedAt }: any) {
  const [comments, setComments] = useState(["Post muito bacana, hein?"]);
  const [newCommentText, setNewCommentText] = useState("");

  const publishedDateFormatted = format(
    publishedAt,
    "d 'de' LLLL 'às' HH:mm'h'",
    { locale: ptBR }
  );
  const publishedDateRelativeToNow = formatDistanceToNow(publishedAt, {
    locale: ptBR,
    addSuffix: true,
  });

  function handleCreateNewComment(event: FormEvent) {
    event?.preventDefault();
    setComments([...comments, newCommentText]);
    setNewCommentText("");
  }

  function handleNewCommentChange(event: ChangeEvent<HTMLTextAreaElement>) {
    event?.target.setCustomValidity("");
    setNewCommentText(event.target!.value);
  }

  function onDeleteComment(commentToDelete: any) {
    const commentWithoutDeleteOne = comments.filter((comment: any) => {
      return comment !== commentToDelete;
    });

    setComments(commentWithoutDeleteOne);
  }

  function handleNewCommentInvalid(event: InvalidEvent<HTMLTextAreaElement>) {
    event?.target.setCustomValidity("Esse campo é obrigatório!");
  }

  return (
    <article className={styles.post}>
      <header>
        <div className={styles.author}>
          <Avatar src={author.avatarUrl} />
          <div className={styles.authorInfo}>
            <strong>{author.name}</strong>
            <span>{author.role}</span>
          </div>
        </div>

        <time
          title={publishedDateFormatted}
          dateTime={publishedAt.toISOString()}
        >
          {publishedDateRelativeToNow}
        </time>
      </header>

      <div className={styles.content}>
        {content.map(
          (
            line: {
              type: string;
              content:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | Iterable<ReactNode>
                | null
                | undefined;
            },
            index: number
          ) => {
            if (line.type === "paragraph") {
              return <p key={index}>{line.content}</p>;
            } else if (line.type === "link") {
              return (
                <a key={index} href="">
                  {line.content}
                </a>
              );
            }
          }
        )}
      </div>

      <form onSubmit={handleCreateNewComment} className={styles.commentForm}>
        <strong>Deixe seu feedback</strong>

        <textarea
          onChange={handleNewCommentChange}
          value={newCommentText}
          placeholder="Deixe um comentário"
          onInvalid={handleNewCommentInvalid}
          required
        ></textarea>

        <button disabled={newCommentText.length === 0} type="submit">
          Publicar
        </button>
      </form>

      <div className={styles.commentList}>
        {comments.map((item: string, index: number) => {
          return (
            <Comment
              content={item}
              key={index}
              onDeleteComment={onDeleteComment}
            />
          );
        })}
      </div>
    </article>
  );
}
