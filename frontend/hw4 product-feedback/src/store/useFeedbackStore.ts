import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { nanoid } from "nanoid";

export type Category = "UI" | "Performance" | "Feature" | "Other";
export interface Feedback {
  id: string;
  text: string;
  votes: number;
  category: Category;
  createdAt: string;
  position: number;
}

type Filter = "all" | "latest" | "popular" | Category;

interface State {
  feedbacks: Feedback[];
  filter: Filter;
  add: (text: string, category: Category) => void;
  remove: (id: string) => void;
  edit: (id: string, text: string, category: Category) => void;
  upvote: (id: string) => void;
  setFilter: (f: Filter) => void;
  swap: (idA: string, idB: string) => void;
}

export const useFeedbackStore = create<State>()(
  persist(
    devtools(set => ({
      feedbacks: [],
      filter: "all",

      add: (text, category) =>
        set(state => {
          const max = Math.max(0, ...state.feedbacks.map(f => f.position));
          return {
            feedbacks: [
              ...state.feedbacks,
              {
                id: nanoid(),
                text,
                category,
                votes: 0,
                createdAt: new Date().toISOString(),
                position: max + 1
              }
            ]
          };
        }),

      remove: id =>
        set(state => ({ feedbacks: state.feedbacks.filter(f => f.id !== id) })),

      edit: (id, text, category) =>
        set(state => ({
          feedbacks: state.feedbacks.map(f =>
            f.id === id ? { ...f, text, category } : f
          )
        })),

      upvote: id =>
        set(state => ({
          feedbacks: state.feedbacks.map(f =>
            f.id === id ? { ...f, votes: f.votes + 1 } : f
          )
        })),

      setFilter: filter => set({ filter }),

      swap: (idA, idB) =>
        set(state => {
          const a = state.feedbacks.find(f => f.id === idA)!;
          const b = state.feedbacks.find(f => f.id === idB)!;
          return {
            feedbacks: state.feedbacks.map(f =>
              f.id === a.id
                ? { ...f, position: b.position }
                : f.id === b.id
                ? { ...f, position: a.position }
                : f
            )
          };
        })
    })),
    { name: "feedback-store" }
  )
);
