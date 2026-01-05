<script>
  import { defaultKeymap } from "@codemirror/commands";
  import { EditorState } from "@codemirror/state";
  import { EditorView, keymap, lineNumbers } from "@codemirror/view";
  import { onMount } from "svelte";

  let { value = "", onChange = () => {} } = $props();

  let editorContainer;
  let editorView;

  const moveLineUp = (view) => {
    const { state } = view;
    const { selection } = state;
    const line = state.doc.lineAt(selection.main.head);

    if (line.number === 1) return false; // Already at top

    const prevLine = state.doc.line(line.number - 1);
    const lineText = state.doc.sliceString(line.from, line.to);
    const prevLineText = state.doc.sliceString(prevLine.from, prevLine.to);

    view.dispatch({
      changes: [
        {
          from: prevLine.from,
          to: line.to,
          insert: lineText + "\n" + prevLineText,
        },
      ],
      selection: { anchor: prevLine.from + lineText.length + 1 },
    });

    return true;
  };

  const moveLineDown = (view) => {
    const { state } = view;
    const { selection } = state;
    const line = state.doc.lineAt(selection.main.head);

    if (line.number === state.doc.lines) return false; // Already at bottom

    const nextLine = state.doc.line(line.number + 1);
    const lineText = state.doc.sliceString(line.from, line.to);
    const nextLineText = state.doc.sliceString(nextLine.from, nextLine.to);

    view.dispatch({
      changes: [
        {
          from: line.from,
          to: nextLine.to,
          insert: nextLineText + "\n" + lineText,
        },
      ],
      selection: { anchor: nextLine.from + nextLineText.length + 1 },
    });

    return true;
  };

  onMount(() => {
    const startState = EditorState.create({
      doc: value,
      extensions: [
        keymap.of([
          ...defaultKeymap,
          { key: "Alt-ArrowUp", run: moveLineUp },
          { key: "Alt-ArrowDown", run: moveLineDown },
        ]),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            const newValue = update.state.doc.toString();
            onChange?.(newValue);
          }
        }),
        lineNumbers(),
        EditorView.theme({
          "&": {
            height: "100%",
            minHeight: "300px",
            fontSize: "14px",
          },
          ".cm-content": {
            fontFamily: "monospace",
            padding: "10px 0",
          },
          ".cm-gutters": {
            backgroundColor: "#f7f7f7",
            borderRight: "1px solid #ddd",
          },
        }),
      ],
    });

    editorView = new EditorView({
      state: startState,
      parent: editorContainer,
    });

    return () => {
      editorView.destroy();
    };
  });

  // Update editor when value prop changes externally
  $effect(() => {
    if (editorView && value !== editorView.state.doc.toString()) {
      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: value,
        },
      });
    }
  });
</script>

<div class="codemirror-wrapper" bind:this={editorContainer}></div>

<style>
  .codemirror-wrapper {
    border: 1px solid #ccc;
    border-radius: 4px;
    overflow: hidden;
    height: 100%;
  }
</style>
