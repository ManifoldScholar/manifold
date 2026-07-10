import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
  useRef
} from "react";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import { ltiAPI } from "api";
import BrowserCookieHelper from "helpers/cookie/Browser";

// Single context for the LTI deep-linking mini-app. It owns both the user's
// selection and the deep-linking session: the opaque context token (from the
// `lti_context` URL param at the landing route), its validation status, and the
// LMS acceptance flags returned by the API.

const STORAGE_KEY = "lti_deep_linking_token";

// The UI keys selection types in camelCase; the API expects the PascalCase
// model class name.
const TYPE_MAP = {
  project: "Project",
  text: "Text",
  textSection: "TextSection",
  resource: "Resource",
  resourceCollection: "ResourceCollection"
};

const DeepLinkingContext = createContext(null);

function keyFor(item) {
  return `${item.type}:${item.id}`;
}

// The token is only present in the URL at the landing route, so capture it once
// and persist it to sessionStorage so in-app navigation and reloads keep it.
function readInitialToken(search) {
  const fromUrl = new URLSearchParams(search).get("lti_context");
  if (typeof window === "undefined") return fromUrl || null;
  if (fromUrl) {
    try {
      window.sessionStorage.setItem(STORAGE_KEY, fromUrl);
    } catch (e) {
      // sessionStorage unavailable (private mode, etc.) — fall back to memory
    }
    return fromUrl;
  }
  try {
    return window.sessionStorage.getItem(STORAGE_KEY);
  } catch (e) {
    return null;
  }
}

function clearStoredToken() {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    // sessionStorage unavailable — nothing to clear
  }
}

export function DeepLinkingProvider({ children }) {
  const { search } = useLocation();
  const [token] = useState(() => readInitialToken(search));

  const reduxAuthToken = useSelector(state => state.authentication?.authToken);
  const authToken = useMemo(() => {
    if (reduxAuthToken) return reduxAuthToken;
    if (typeof window === "undefined") return null;
    return new BrowserCookieHelper().read("authToken") || null;
  }, [reduxAuthToken]);

  // Selection
  const [items, setItems] = useState([]);

  const add = useCallback(item => {
    setItems(current => {
      const key = keyFor(item);
      if (current.some(i => keyFor(i) === key)) return current;
      return [...current, item];
    });
  }, []);

  const remove = useCallback(item => {
    setItems(current => {
      const key = keyFor(item);
      return current.filter(i => keyFor(i) !== key);
    });
  }, []);

  const has = useCallback(item => items.some(i => keyFor(i) === keyFor(item)), [
    items
  ]);

  // Session validation
  const [status, setStatus] = useState(token ? "loading" : "invalid");
  const [acceptTypes, setAcceptTypes] = useState(null);
  const [acceptMultiple, setAcceptMultiple] = useState(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return undefined;
    if (!token) {
      setStatus("invalid");
      return undefined;
    }
    // Wait until the auth token is available before validating the session.
    if (!authToken) return undefined;

    fetchedRef.current = true;
    let active = true;
    ltiAPI.fetchContext({ contextToken: token, authToken }).then(
      data => {
        if (!active) return;
        setAcceptTypes(data.accept_types ?? null);
        setAcceptMultiple(data.accept_multiple ?? null);
        setStatus("ready");
      },
      () => {
        if (!active) return;
        setStatus("invalid");
      }
    );

    return () => {
      active = false;
    };
  }, [token, authToken]);

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [returnData, setReturnData] = useState(null);

  const submit = useCallback(() => {
    // The token is single-use; block re-entry once a submission is in flight or
    // has succeeded (the return form is about to navigate away).
    if (submitting || returnData || !items.length) return undefined;

    setSubmitting(true);
    setSubmitError(null);

    const selection = items.map(item => ({
      type: TYPE_MAP[item.type] ?? item.type,
      id: item.id,
      title: item.title
    }));

    return ltiAPI.submit({ contextToken: token, selection, authToken }).then(
      data => {
        // The token is consumed server-side now; drop our copy so a manual
        // return to the route lands in a clean no-token state.
        clearStoredToken();
        // Keep submitting=true: the return form takes over and posts to the LMS.
        setReturnData({
          deepLinkReturnUrl: data.deep_link_return_url,
          jwt: data.jwt
        });
      },
      error => {
        setSubmitting(false);
        setSubmitError(error);
      }
    );
  }, [submitting, returnData, items, token, authToken]);

  const value = useMemo(
    () => ({
      token,
      status,
      acceptTypes,
      acceptMultiple,
      items,
      add,
      remove,
      has,
      submit,
      submitting,
      submitError,
      returnData
    }),
    [
      token,
      status,
      acceptTypes,
      acceptMultiple,
      items,
      add,
      remove,
      has,
      submit,
      submitting,
      submitError,
      returnData
    ]
  );

  return (
    <DeepLinkingContext.Provider value={value}>
      {children}
    </DeepLinkingContext.Provider>
  );
}

export function useDeepLinking() {
  const ctx = useContext(DeepLinkingContext);
  if (!ctx)
    throw new Error("useDeepLinking must be used within DeepLinkingProvider");
  return ctx;
}

// Selection-only view, kept so existing consumers need no changes.
export function useSelection() {
  const { items, add, remove, has } = useDeepLinking();
  return useMemo(() => ({ items, add, remove, has }), [
    items,
    add,
    remove,
    has
  ]);
}

export default DeepLinkingContext;
