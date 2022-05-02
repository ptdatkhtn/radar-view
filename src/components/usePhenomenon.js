import { useState, useEffect } from "react"
import { getPhenomenonByUUIDAndGroup } from "@sangre-fp/connectors/phenomena-api"
import { getPhenomena } from '@sangre-fp/connectors/search-api'
import { useDispatch } from 'react-redux'

export const usePhenomenon = (phenomenonId, groupId, skip) => {
  const dispatch = useDispatch()
  const [phenomenon, setPhenomenon] = useState(null);
  const [loading, setLoading] = useState(!!phenomenonId);
  const [error, setError] = useState(null);

  const handlePhenomenonId = async (id, group) => {
    setLoading(true);
    setError(null);

    try {
      // To-do: promise all 2 requests below
      const a = await getPhenomenonByUUIDAndGroup(id, group)
      const b = await getPhenomena({
        groups: [group],
        phenomena: [id]
      })
      console.log('aaaa1111', a)
      console.log('b22222', b)
    // dispatch({ type: 'STOREDPHENOMENON', payload:  {...a, tags: b?.result[0]?.tags, 'tags_fp:docs/props/has': b?.result[0]['tags_fp:docs/props/has']}})

      setPhenomenon({...a, tags: b?.result[0]?.tags, 'tags_fp:docs/props/has': b?.result[0]['tags_fp:docs/props/has']})
    } catch (e) {
      setError(e)
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!skip && phenomenonId) {
      handlePhenomenonId(phenomenonId, groupId);
    } else {
      setPhenomenon(null);
    }
  }, [phenomenonId, groupId, skip]);

  return {
    phenomenon,
    loading,
    error
  };
};

export const PhenomenonLoader = ({ id, group, children, skip }) => {

  const loader = usePhenomenon(id, group, skip)

  return children(loader)
};
